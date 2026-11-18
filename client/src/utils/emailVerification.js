// client/src/utils/emailVerification.js
// Email/password accounts must verify their email. Accounts that only use Google or GitHub come verified.
// (The server decides by the way you signed in; this matches it for accounts that have a password.)
export const needsEmailVerification = (firebaseUser) =>
  Boolean(firebaseUser) &&
  !firebaseUser.emailVerified &&
  firebaseUser.providerData.some(({ providerId }) => providerId === 'password');