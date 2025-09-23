const express = require('express');
const router = express.Router();
import AuthRouter from './AuthRouter.js'

router.use('/auth', AuthRouter);

export default router;
