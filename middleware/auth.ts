// src/middleware/auth.ts
import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Request, Response, NextFunction } from "express";

// Environment variables
const domain = process.env.AUTH0_DOMAIN!;
const audience = process.env.AUTH0_AUDIENCE!;

// -------------------------
// JWT Middleware
// -------------------------
// This middleware verifies the JWT sent in Authorization header
export const checkJwt = expressjwt({
  // Provide a function to retrieve signing keys from Auth0
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }) as unknown as GetVerificationKey, // TypeScript workaround

  // Validate the audience and issuer
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ["RS256"],

  // Store the decoded token payload in req.auth
  requestProperty: "auth",
});

// -------------------------
// Admin Role Middleware
// -------------------------

// Extend Express Request type to include 'auth' property
interface AuthRequest extends Request {
  auth?: {
    [key: string]: unknown; // token payload
  };
}

// Middleware to allow only users with admin role
export const checkAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Token payload is in req.auth
  const roles = req.auth?.["https://distim.com/role"];

  if (roles !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};
