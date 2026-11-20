import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { INITIAL_PROJECTS } from '../data/portfolio';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import {
  ADMIN_EMAIL,
  BLUEPRINT_LIMITS,
  BriefStatus,
  clampString,
  PortfolioProject,
  ProjectBriefRecord,
  sanitizeBriefPayload,
  sanitizeProjectPayload,
  UserProfileRecord,
} from '../lib/validation';

interface FirebaseContextValue {
  user: User | null;
  profile: UserProfileRecord | null;
  authReady: boolean;
  isAdmin: boolean;
  authBusy: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
  projects: PortfolioProject[];
  projectsLive: boolean;
  briefs: ProjectBriefRecord[];
  submitBrief: (input: {
    name: string;
    email: string;
    service: string;
    budget: string;
    message: string;
  }) => Promise<string>;
  updateBriefStatus: (briefId: string, status: BriefStatus) => Promise<void>;
  deleteBrief: (briefId: string) => Promise<void>;
  saveProject: (project: Omit<PortfolioProject, 'ownerUid'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

function getTimestampMillis(ts: unknown): number {
  if (ts && typeof ts === 'object' && 'toMillis' in ts && typeof (ts as { toMillis: () => number }).toMillis === 'function') {
    return (ts as { toMillis: () => number }).toMillis();
  }
  return 0;
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileRecord | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>(INITIAL_PROJECTS);
  const [projectsLive, setProjectsLive] = useState(false);
  const [briefs, setBriefs] = useState<ProjectBriefRecord[]>([]);
  const [fatalError, setFatalError] = useState<Error | null>(null);

  if (fatalError) {
    throw fatalError;
  }

  const isAdmin = useMemo(() => {
    const bootstrapped = Boolean(user?.emailVerified && user.email === ADMIN_EMAIL);
    return bootstrapped || profile?.role === 'admin';
  }, [user, profile]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) {
        setProfile(null);
        setBriefs([]);
        setProjects(INITIAL_PROJECTS);
        setProjectsLive(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Ensure signed-in user profile exists and sync it in real time
  useEffect(() => {
    if (!authReady || !user || !user.email) return;

    let cancelled = false;
    const userPath = `users/${user.uid}`;
    const userRef = doc(db, 'users', user.uid);

    const syncUserProfile = async () => {
      try {
        const snap = await getDoc(userRef);
        const safeName = clampString(
          user.displayName || user.email?.split('@')[0] || 'Client',
          BLUEPRINT_LIMITS.user.displayName.maxLength,
        );
        const safeEmail = clampString(user.email || '', BLUEPRINT_LIMITS.user.email.maxLength);
        const safePhoto = user.photoURL
          ? clampString(user.photoURL, BLUEPRINT_LIMITS.user.photoURL.maxLength)
          : undefined;

        if (!snap.exists()) {
          const isBootAdmin = Boolean(user.emailVerified && user.email === ADMIN_EMAIL);
          const newDoc: Record<string, unknown> = {
            uid: user.uid,
            displayName: safeName,
            email: safeEmail,
            role: isBootAdmin ? 'admin' : 'client',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          if (safePhoto) {
            newDoc.photoURL = safePhoto;
          }
          await setDoc(userRef, newDoc);
        } else {
          const existingData = snap.data();
          const updates: Record<string, unknown> = {
            displayName: safeName,
            updatedAt: serverTimestamp(),
          };
          if (safePhoto) {
            updates.photoURL = safePhoto;
          } else if (existingData.photoURL) {
            updates.photoURL = existingData.photoURL;
          }
          if (existingData.displayName !== safeName || (safePhoto && existingData.photoURL !== safePhoto)) {
            await updateDoc(userRef, updates);
          }
        }
      } catch (err) {
        if (!cancelled) {
          try {
            handleFirestoreError(err, OperationType.WRITE, userPath);
          } catch (wrapped) {
            setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
          }
        }
      }
    };

    void syncUserProfile();

    const unsubProfile = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          setProfile(snap.data() as UserProfileRecord);
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.GET, userPath);
        } catch (wrapped) {
          setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
        }
      },
    );

    return () => {
      cancelled = true;
      unsubProfile();
    };
  }, [authReady, user]);

  // Real-time Projects stream (only when auth is ready and user is authenticated)
  useEffect(() => {
    if (!authReady || !user) return;

    const isBootAdmin = Boolean(user.emailVerified && user.email === ADMIN_EMAIL);
    const projectsPath = 'projects';
    const projectsQuery = isBootAdmin
      ? collection(db, projectsPath)
      : query(collection(db, projectsPath), where('published', '==', true));

    let seededOnce = false;

    const unsubProjects = onSnapshot(
      projectsQuery,
      async (snapshot) => {
        if (snapshot.empty) {
          if (isBootAdmin && !seededOnce) {
            seededOnce = true;
            try {
              const batch = writeBatch(db);
              INITIAL_PROJECTS.forEach((proj, idx) => {
                const payload = sanitizeProjectPayload({
                  ...proj,
                  sortOrder: idx,
                  published: true,
                  ownerUid: user.uid,
                });
                batch.set(doc(db, projectsPath, payload.id), {
                  ...payload,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                });
              });
              await batch.commit();
            } catch (err) {
              try {
                handleFirestoreError(err, OperationType.WRITE, projectsPath);
              } catch (wrapped) {
                setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
              }
            }
          } else {
            setProjects(INITIAL_PROJECTS);
          }
          return;
        }

        const loaded = snapshot.docs
          .map((d) => d.data() as PortfolioProject)
          .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

        setProjects(loaded);
        setProjectsLive(true);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, projectsPath);
        } catch (wrapped) {
          setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
        }
      },
    );

    return () => unsubProjects();
  }, [authReady, user]);

  // Real-time Briefs stream (only when auth is ready and user is authenticated)
  useEffect(() => {
    if (!authReady || !user) return;

    const isBootAdmin = Boolean(user.emailVerified && user.email === ADMIN_EMAIL);
    const briefsPath = 'briefs';
    const briefsQuery = isBootAdmin
      ? collection(db, briefsPath)
      : query(collection(db, briefsPath), where('authorUid', '==', user.uid));

    const unsubBriefs = onSnapshot(
      briefsQuery,
      (snapshot) => {
        const list: ProjectBriefRecord[] = snapshot.docs
          .map((d) => ({
            id: d.id,
            ...(d.data() as Omit<ProjectBriefRecord, 'id'>),
          }))
          .sort((a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt));
        setBriefs(list);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, briefsPath);
        } catch (wrapped) {
          setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
        }
      },
    );

    return () => unsubBriefs();
  }, [authReady, user]);

  const signInWithGoogle = useCallback(async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to sign in with Google.';
      if (!msg.includes('popup-closed-by-user')) {
        setAuthError(msg);
      }
      return null;
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Unable to sign out.');
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const submitBrief = useCallback(
    async (input: {
      name: string;
      email: string;
      service: string;
      budget: string;
      message: string;
    }) => {
      if (!auth.currentUser) {
        throw new Error('Authentication required to submit a brief.');
      }
      const briefsPath = 'briefs';
      const sanitized = sanitizeBriefPayload({
        ...input,
        authorUid: auth.currentUser.uid,
      });
      try {
        const ref = await addDoc(collection(db, briefsPath), {
          ...sanitized,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return ref.id;
      } catch (err) {
        return handleFirestoreError(err, OperationType.CREATE, briefsPath);
      }
    },
    [],
  );

  const updateBriefStatus = useCallback(async (briefId: string, status: BriefStatus) => {
    const path = `briefs/${briefId}`;
    try {
      await updateDoc(doc(db, 'briefs', briefId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }, []);

  const deleteBrief = useCallback(async (briefId: string) => {
    const path = `briefs/${briefId}`;
    try {
      await deleteDoc(doc(db, 'briefs', briefId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }, []);

  const saveProject = useCallback(async (project: Omit<PortfolioProject, 'ownerUid'>) => {
    if (!auth.currentUser) {
      throw new Error('Authentication required.');
    }
    const sanitized = sanitizeProjectPayload({
      ...project,
      ownerUid: auth.currentUser.uid,
    });
    const path = `projects/${sanitized.id}`;
    try {
      const ref = doc(db, 'projects', sanitized.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, {
          title: sanitized.title,
          subtitle: sanitized.subtitle,
          category: sanitized.category,
          year: sanitized.year,
          image: sanitized.image,
          blurb: sanitized.blurb,
          description: sanitized.description,
          deliverables: sanitized.deliverables,
          tools: sanitized.tools,
          span: sanitized.span,
          sortOrder: sanitized.sortOrder,
          published: sanitized.published,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ref, {
          ...sanitized,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    const path = `projects/${projectId}`;
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }, []);

  const value = useMemo<FirebaseContextValue>(
    () => ({
      user,
      profile,
      authReady,
      isAdmin,
      authBusy,
      authError,
      clearAuthError,
      signInWithGoogle,
      signOutUser,
      projects,
      projectsLive,
      briefs,
      submitBrief,
      updateBriefStatus,
      deleteBrief,
      saveProject,
      deleteProject,
    }),
    [
      user,
      profile,
      authReady,
      isAdmin,
      authBusy,
      authError,
      clearAuthError,
      signInWithGoogle,
      signOutUser,
      projects,
      projectsLive,
      briefs,
      submitBrief,
      updateBriefStatus,
      deleteBrief,
      saveProject,
      deleteProject,
    ],
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return ctx;
}
