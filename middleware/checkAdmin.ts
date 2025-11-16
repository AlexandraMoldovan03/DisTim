import { Response, NextFunction } from "express";

// define a local interface that includes auth
interface AuthenticatedRequest extends Express.Request {
  auth?: {
    "https://distim.com/role"?: string;
    [key: string]: unknown;
  };
}

export const checkAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const role = req.auth?.["https://distim.com/role"];

  if (role !== "Admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};
