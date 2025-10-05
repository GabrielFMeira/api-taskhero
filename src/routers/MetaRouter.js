import express from "express";
import MetaController from "../controller/MetaController.js";
import {validateToken} from "../middlewares/Auth.js";

const routes = express.Router();

routes.use(validateToken);
routes.post('/create', MetaController.createMeta);

export default routes;