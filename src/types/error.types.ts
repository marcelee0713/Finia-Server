export type ErrorType =
  | "user-already-exist"
  | "user-already-verified"
  | "user-already-logged-in"
  | "user-does-not-exist"
  | "invalid-request"
  | "invalid-username"
  | "invalid-password"
  | "invalid-email"
  | "invalid-email-verification"
  | "invalid-amount"
  | "invalid-transaction-type"
  | "invalid-note"
  | "invalid-password-reset-request"
  | "email-service-error"
  | "email-dev-error"
  | "email-dev-req-error"
  | "category-does-not-exist"
  | "uid-mismatch"
  | "same-password-reset-request"
  | "wrong-credentials"
  | "not-authorized"
  | "blacklisted-token"
  | "unverified-email"
  | "internal-server-error";
