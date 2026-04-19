import { Router } from 'express';
import { financialInsightsController } from '../controllers/FinancialInsightsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Get financial insights
router.get('/', protect, financialInsightsController.getInsights.bind(financialInsightsController));

// Ask natural language query
router.post('/query', protect, financialInsightsController.askQuery.bind(financialInsightsController));

export default router;
