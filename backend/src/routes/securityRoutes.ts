import { Router } from 'express';
import { securityController } from '../controllers/SecurityController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Set transaction PIN
router.post('/pin', protect, securityController.setTransactionPin.bind(securityController));

// Validate transaction PIN
router.post('/pin/validate', protect, securityController.validateTransactionPin.bind(securityController));

export default router;
