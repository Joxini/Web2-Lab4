import { Router } from "express";
import FacturaController from "../controller/FacturaController";

const routes = Router();

routes.get("", FacturaController.getAll);
//Para que determine que es paracmetro, ponemos los dos :
routes.get("/:numero", FacturaController.getById);
//Para poder agregar un dato a la base de datos, desde el postman
routes.post("", FacturaController.add);
routes.patch("/:numero", FacturaController.update);
routes.delete("/detalle/:numero", FacturaController.deleteDetalle);
routes.delete("/:numero", FacturaController.delete);
export default routes;