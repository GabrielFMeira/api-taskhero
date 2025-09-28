import express from 'express';
import AuthRouter from './AuthRouter.js'
import MetaRouter from './MetaRouter.js'
import TarefaRouter from './TarefaRouter.js'

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/meta', MetaRouter);
router.use('/tarefa', TarefaRouter);

export default router;
