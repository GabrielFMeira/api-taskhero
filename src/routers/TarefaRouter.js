import express from "express";
import TarefaController from "../controller/TarefaController.js";
import {validateToken} from "../middlewares/Auth.js";

const routes = express.Router();

routes.use(validateToken)
routes.post('/:metaId/create', TarefaController.createTask)

export default routes;