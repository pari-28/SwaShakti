import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = verifyToken(token) as JwtPayload;

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};