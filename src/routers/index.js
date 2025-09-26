import express from 'express';
import AuthRouter from './AuthRouter.js'
import MetaRouter from './MetaRouter.js'

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/meta', MetaRouter);

export default router;
