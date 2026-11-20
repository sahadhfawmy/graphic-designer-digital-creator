# Security Specification — Sahadh Fawmy Portfolio

## 1. Data Invariants
1. **Default Deny**: Every unmatched Firestore path is explicitly denied via `match /{document=**} { allow read, write: if false; }`.
2. **Verified Identity**: All writes and private reads require `request.auth != null && request.auth.token.email_verified == true`.
3. **Identity & Role Integrity**:
   - Users in `/users/{userId}` can only create their own document with `uid == request.auth.uid` and `role == 'client'` (unless verified bootstrapped admin). Self-escalation of `role` is impossible.
   - PII (`email`, `displayName`) in `/users/{userId}` and `/briefs/{briefId}` is never readable by unrelated authenticated users.
4. **Portfolio Catalog Integrity**:
   - `/projects/{projectId}` can only be created, updated, or deleted by verified admins.
   - Authenticated visitors can `get` or `list` `/projects` only where `resource.data.published == true` (enforced inside the rule, not delegated to client queries).
5. **Project Brief Lifecycle & Terminal Locking**:
   - `/briefs/{briefId}` must be created with `authorUid == request.auth.uid`, `status == 'submitted'`, and `createdAt == request.time == updatedAt`.
   - Authors can edit their own brief only while `status` is non-terminal (`submitted` or `reviewing`) and cannot alter `status`, `authorUid`, or `createdAt`.
   - Once `status` reaches `'accepted'` or `'archived'`, non-admin updates are blocked (Terminal State Locking).
   - Only admins can transition `status`.
6. **Volumetric & Type Bounds**:
   - Every string field enforces exact `minLength`/`maxLength` and regex patterns matching `firebase-blueprint.json`.
   - Document IDs are validated with `^[a-zA-Z0-9_\\-]+$` and max length 128.
   - Array fields (`deliverables`, `tools`) are bounded to `<= 10` items with element type checks.

## 2. The "Dirty Dozen" Adversarial Payloads (Must All Return PERMISSION_DENIED)
1. **Unauthenticated Brief Write**: `POST /briefs/b1` with `request.auth == null`.
2. **Unverified Admin Email Spoof**: `GET /briefs/b1` or `POST /projects/p1` with `token.email == "fawmysahadh90@gmail.com"` and `email_verified == false`.
3. **Self-Assigned Admin Role on Signup**: `CREATE /users/{uid}` with `{ ..., role: "admin" }` by non-admin user.
4. **Role Escalation on Profile Update**: `UPDATE /users/{uid}` changing `role` from `"client"` to `"admin"`.
5. **Cross-User PII Read**: `GET /users/victimUid` by `attackerUid`.
6. **Blanket Brief List Scraping**: `LIST /briefs` without `where("authorUid", "==", request.auth.uid)` by non-admin.
7. **Author Identity Spoofing on Brief Create**: `CREATE /briefs/b2` with `authorUid: "someone_else"`.
8. **Shadow / Ghost Field Injection**: `CREATE /briefs/b3` containing extra field `isPriorityAdmin: true`.
9. **Brief Status State Shortcutting by Author**: `CREATE /briefs/b4` with `status: "accepted"`, or `UPDATE` changing `status` to `"accepted"` as author.
10. **Terminal Brief Mutation**: `UPDATE /briefs/b5` by author when `existing().status == "accepted"`.
11. **Resource / ID Poisoning**: `CREATE /briefs/<150-char invalid ID!@#>` or `message` > 2000 chars or `deliverables` array > 10 items.
12. **Client Timestamp Forgery**: `CREATE /briefs/b6` with backdated `createdAt` (`!= request.time`).
