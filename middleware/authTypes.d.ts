import "express";

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      [key: string]: unknown;
    };
  }
}
