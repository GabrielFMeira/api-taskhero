import express from "express";
import RecompensaController from "../controller/RecompensaController.js";

const routes = express.Router();

routes.post('/buy/:recompensaId', RecompensaController.compraLogotipo);

export default routes;