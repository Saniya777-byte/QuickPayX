import { Request, Response } from "express";
import AuthService from "../services/AuthService";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};