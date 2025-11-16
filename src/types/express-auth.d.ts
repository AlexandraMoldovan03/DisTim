import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      "https://distim.com/role"?: string;
      [key: string]: unknown; // allow other claims too
    };
  }
}
