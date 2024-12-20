import express from 'express';
import { registerUser, loginUser, verifyUser } from '../controllers/authController.mjs';
import { protectRoute } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyUser);
router.get('/protected', protectRoute, (req, res) => {
    res.status(200).json({ message: 'Welcome to the protected route!', userId: req.userId });
});

export default router;
