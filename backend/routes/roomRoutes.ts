import { Router } from 'express';
import { joinRoom, getUserHistory } from '../controllers/roomController';

const router = Router();

router.post('/rooms/join', joinRoom);
router.get('/user-history/:clerkId', getUserHistory);

export default router;
