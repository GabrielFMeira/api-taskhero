import express from "express";
import MetaController from "../controller/MetaController.js";
import {validateToken} from "../middlewares/Auth.js";

const routes = express.Router();

routes.use(validateToken);
routes.post('/create', MetaController.createMeta);
routes.delete('/delete/:metaId', MetaController.deleteMeta);
routes.put('/update/:metaId', MetaController.updateMeta);
routes.put('/update/:metaId/conclude', MetaController.concludeMeta);

export default routes;