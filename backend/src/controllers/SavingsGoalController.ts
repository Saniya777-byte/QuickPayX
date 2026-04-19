import { Request, Response } from "express";
import SavingsGoalService from "../services/SavingsGoalService";

export const createGoal = async (req: any, res: Response) => {
  try {
    const { name, targetAmount, deadline, category } = req.body;
    const goal = await SavingsGoalService.createGoal(req.user, name, targetAmount, deadline, category);
    res.json(goal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserGoals = async (req: any, res: Response) => {
  try {
    const goals = await SavingsGoalService.getUserGoals(req.user);
    res.json(goals);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGoal = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const goal = await SavingsGoalService.updateGoal(id, updates);
    res.json(goal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteGoal = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await SavingsGoalService.deleteGoal(id);
    res.json({ message: "Goal deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const addProgress = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const goal = await SavingsGoalService.addProgress(id, amount);
    res.json(goal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getGoalSummary = async (req: any, res: Response) => {
  try {
    const summary = await SavingsGoalService.getGoalSummary(req.user);
    res.json(summary);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
