// src/types/express-auth.d.ts
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    /**
     * Token payload attached by express-jwt (we call it `auth` in middleware config).
     * Keep this generic to accept arbitrary claims; tighten as needed.
     */
    auth?: {
      [key: string]: unknown;
    };
  }
}
