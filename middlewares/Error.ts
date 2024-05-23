import { NextFunction, Request, Response } from "express";

export default class ErrorMiddleware {
  static handle(err: Error, req: Request, res: Response, next: NextFunction) {
    // * API & Views
    if (req.originalUrl.startsWith("/api")) {
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        stack: err.stack,
      });
    }

    next();
  }
}
