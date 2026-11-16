# Security Specification — Arthabiz | Sikshyatech Hub

## Data Invariants
1. **Profile Ownership & Role Integrity**: A user document at `/users/{userId}` can only be created or read by the verified owner (`request.auth.uid == userId`) or an authorized admin. Non-admins may only create a profile with `role: "student"` and cannot modify `role` or `uid`.
2. **PII Isolation**: Email addresses are stored exclusively in `/users/{userId}/private/info`, readable only by the owner or an admin (`allow list: if false`).
3. **Master Gate for Subcollections**: All subcollections (`/dayProgress/{dayId}`, `/notes/{noteId}`, `/private/info`) require the parent `/users/{userId}` document to exist.
4. **Action-Based State Transitions**: Progress documents (`/dayProgress/day_1` .. `day_15`) strictly separate unlock, auto-save, submission, and retake actions via `affectedKeys().hasOnly(...)`.
5. **Temporal Integrity**: All `createdAt` and `updatedAt` timestamps must match `request.time`.

## Adversarial ("Dirty Dozen") Payloads Rejected by Rules
1. Unauthenticated read/write to `/users/{uid}` -> DENIED (`isVerifiedUser()` fails).
2. Unverified email (`email_verified == false`) attempting to write or spoof admin email -> DENIED.
3. Student attempting to create `/users/{uid}` with `role: "trainer"` -> DENIED.
4. Student attempting to update `/users/{uid}` to escalate `role: "trainer"` -> DENIED.
5. Student attempting to write a shadow field `{ isVerified: true }` on `/users/{uid}` -> DENIED (`hasOnly` check).
6. User A attempting to read `/users/{userB}/private/info` -> DENIED (`isOwner` fails).
7. User attempting to create `/users/{uid}/dayProgress/day_99` -> DENIED (`isValidDayId` fails).
8. User attempting to inject >50 answers or >10KB scratchpad string -> DENIED (`size()` bounds).
9. User attempting to forge `createdAt` or `updatedAt` with client clock instead of `serverTimestamp()` -> DENIED (`request.time` check).
10. User attempting to change `score` during an unsubmitted practice auto-save -> DENIED (`affectedKeys().hasOnly(...)` fails).
11. User attempting to create `/admins/{uid}` without existing admin status -> DENIED.
12. User attempting to list all `/users` without admin email -> DENIED (`allow list: if isAdminEmail()`).
