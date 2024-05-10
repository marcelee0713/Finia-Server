import rateLimit from "express-rate-limit";

export const transactionCUDRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

export const transactionReadRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 250,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});
