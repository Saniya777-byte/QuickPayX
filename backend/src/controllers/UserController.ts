import { Request, Response } from "express";
import UserService from "../services/UserService";

export const searchUsers = async (req: any, res: Response) => {
  try {
    const { q } = req.query;
    const users = await UserService.searchUsers(q, req.user);
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getRecentUsers = async (req: any, res: Response) => {
  try {
    const users = await UserService.getRecentUsers(req.user);
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
