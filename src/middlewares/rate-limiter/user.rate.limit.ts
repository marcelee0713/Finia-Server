import rateLimit from "express-rate-limit";

export const emailAndPasswordVerificationRequestRateLimit = rateLimit({
  validate: {
    validationsConfig: false,
  },
  windowMs: 60 * 1000,
  limit: 2,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

export const emailAndPassVerifyingRateLimit = rateLimit({
  validate: {
    validationsConfig: false,
  },
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

export const loginAndOutRateLimit = rateLimit({
  validate: {
    validationsConfig: false,
  },
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

export const createAccountRateLimit = rateLimit({
  validate: {
    validationsConfig: false,
  },
  windowMs: 3 * 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

export const passwordModificationRateLimit = rateLimit({
  validate: {
    validationsConfig: false,
  },
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

export const getUserDataRateLimit = rateLimit({
  validate: {
    validationsConfig: false,
  },
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});
