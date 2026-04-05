import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config";

export interface JwtPayload {
  walletAddress: string;
  role?: "admin";
}

/**
 * Protect admin routes - verify JWT token
 */
export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, CONFIG.jwtSecret) as JwtPayload;
    (req as any).user = payload;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token expired" });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}

/**
 * Generate admin JWT token
 * Called by admin login route (or manually for demo)
 */
export function generateAdminToken(walletAddress: string): string {
  const expiresIn = CONFIG.jwtExpiresIn as jwt.SignOptions["expiresIn"];

  return jwt.sign(
    {
      walletAddress,
      role: "admin",
    },
    CONFIG.jwtSecret,
    { expiresIn }
  );
}
