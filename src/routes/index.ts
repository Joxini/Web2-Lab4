import { Router } from "express";
import producto from "./productos";
import Proveedor from "./Proveedores";
import Vendedor from "./Vendedores";
import Cliente  from "./Clientes";
import FacturaController from "./Factura";


const routes = Router();

routes.use('/Productos',producto);
routes.use('/Proveedores',Proveedor);
routes.use('/Vendedores',Vendedor);
routes.use('/Clientes',Cliente);
routes.use('/Factura',FacturaController);





export default routes;