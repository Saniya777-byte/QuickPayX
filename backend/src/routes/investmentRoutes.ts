import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getInvestment,
  buyStock,
  sellStock,
  getPortfolioSummary
} from '../controllers/InvestmentController';

const router = Router();

router.use(protect);

router.get('/', getInvestment);
router.post('/buy', buyStock);
router.post('/sell', sellStock);
router.get('/portfolio-summary', getPortfolioSummary);

export default router;
