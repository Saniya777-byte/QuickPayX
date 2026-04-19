import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

export class SecurityController {
  async setTransactionPin(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id;
      const { pin } = req.body;

      if (!pin) {
        return res.status(400).json({
          success: false,
          message: 'PIN is required'
        });
      }

      // Validate PIN format (4 digits)
      if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({
          success: false,
          message: 'PIN must be 4 digits'
        });
      }

      await userRepository.update(userId, { transactionPin: pin });

      res.json({
        success: true,
        message: 'Transaction PIN set successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to set PIN'
      });
    }
  }

  async validateTransactionPin(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id;
      const { pin } = req.body;

      if (!pin) {
        return res.status(400).json({
          success: false,
          message: 'PIN is required'
        });
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!user.transactionPin) {
        return res.status(400).json({
          success: false,
          message: 'No transaction PIN set. Please set one first.'
        });
      }

      if (user.transactionPin !== pin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid PIN'
        });
      }

      res.json({
        success: true,
        message: 'PIN validated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to validate PIN'
      });
    }
  }
}

export const securityController = new SecurityController();
