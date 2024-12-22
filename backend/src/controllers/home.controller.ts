import { Request, Response } from "express";

export function welcome(req: Request, res: Response): Response {
  return res.json({ success: true, message: "Welcome to the API!" });
}
