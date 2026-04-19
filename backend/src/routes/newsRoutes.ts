import { Router } from 'express';
import { getNews } from '../controllers/NewsController';

const router = Router();

// News endpoints (public - no auth required for news)
router.get('/', getNews);

export default router;
