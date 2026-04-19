import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getAllStocks,
  searchStocks,
  getStockBySymbol,
  getLivePrice,
  getTopGainers,
  getTopLosers,
  getSectors
} from '../controllers/StockDataController';

const router = Router();

// Stock data endpoints (public - no auth required for market data)
router.get('/', getAllStocks);
router.get('/search', searchStocks);
router.get('/symbol/:symbol', getStockBySymbol);
router.get('/live/:symbol', getLivePrice);
router.get('/top-gainers', getTopGainers);
router.get('/top-losers', getTopLosers);
router.get('/sectors', getSectors);

export default router;
