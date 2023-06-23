import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cabecera_Factura } from "../entity/Cabecera_Factura";
import { Detalle_Factura } from "../entity/Detalle_Factura";

class FacturaController {

    static getAll = async (req: Request, resp: Response) => {

        //Creamos el trycatch, para que el server no se caiga en posible error.
        try {
            //Creamos metodo de GetAll, Creamos instancia de AppDataSource.
            const CabFacRepo = AppDataSource.getRepository(Cabecera_Factura)
            const DetFacRepo = AppDataSource.getRepository(Detalle_Factura)
            //Siempre vamos a usar un await, await = espere
            //Dentro del Find, podemos crear una condicion. Por ejemplo : 
            //find({where: {estado:true}})
            const ListaCabFacRepo = await CabFacRepo.find();
            const ListaDetFacRepo = await DetFacRepo.find();
            //Creamos validacion para ver si hay datos en la tabala
            if (ListaCabFacRepo.length == 0 && ListaDetFacRepo.length == 0) {
                return resp.status(404).json({ mensaje: 'No hay Facturas en la base de datos' });
            }
            //Siempre tiene que devolver un dato, para el cliente.
            // Y si en un caso si hubiera datos en la base de datos, 
            //devolvemos la lista de productos
            return resp.status(200).json({ ListaCabFacRepo, ListaDetFacRepo });
        } catch (error) {
            //En posible error, lo que hacemos es devolver el error
            return resp.status(400).json({ mensaje: error.error });
        }
    }
    static getById = async (req: Request, resp: Response) => {

        const detalle_factura = Cabecera_Factura
        let Numero;
        //Ponemos ecepxiones
        try {
            //Extraemos el id, en fomrato Int
            Numero = parseInt(req.params["numero"]);
            if (!Numero) {
                return resp.status(404).json({ mensaje: 'No se indica el ID' })
            }
            //Hacemos la instancia del repositorio
            let FacturaCab, FacturaDet;

            // Podemos utilizar tambien el trycatch, y asi nos ahorramos el if
            try {
                //Utilizamos el findOneOrFail, para que cree una exepcion en caso de que no
                // Encuentre
                const CabceraRepo = AppDataSource.getRepository(Cabecera_Factura);
                const DetalleRepo = AppDataSource.getRepository(Detalle_Factura);

                FacturaCab = await CabceraRepo.findOneOrFail({ where: { Numero } })
                FacturaDet = await DetalleRepo.findOneOrFail({ where: { Numero } })
            } catch (error) {
                return resp.status(404).json({ mensaje: 'No se encontro la factura con ese ID' })
            }


            return resp.status(200).json({ FacturaCab, FacturaDet })
        } catch (error) {
            //En posible error, lo que hacemos es devolver el error
            return resp.status(400).json({ mensaje: error.error });
        }
    }

    static add = async (req: Request, resp: Response) => {


        //Agregamos el trycath
        try {
            // Destructuring
            // De esa manera estamos sacando del body esos datos:
            const { Numero, Fecha, Ruc_Cliente, CodigoProveedor, Cantidad, Codigo_Productos } = req.body;
            //ValCodigo_Productoamos los datos de entrada
            if (!Numero) {
                return resp.status(404).json({ mensaje: 'Debe indicar el Numero' })
            }
            if (!Fecha) {
                return resp.status(404).json({ mensaje: 'Debe indicar la fecha' })
            }
            if (!Ruc_Cliente) {
                return resp.status(404).json({ mensaje: 'Debe indicar el Ruc_Cliente' })
            }
            if (!CodigoProveedor) {
                return resp.status(404).json({ mensaje: 'Debe indicar el CodigoProveedor' })
            }
            if (Cantidad < 0) {
                return resp.status(404).json({ mensaje: 'Debe indicar la Cantidad mayor que 0' })
            }
            if (!Codigo_Productos) {
                return resp.status(404).json({ mensaje: 'Debe indicar el Codigo_Productos' })
            }

            //Hacemos la instancia del repositorio
            const CabceraRepo = AppDataSource.getRepository(Cabecera_Factura);
            const DetalleRepo = AppDataSource.getRepository(Detalle_Factura);
            let FacturaCab, FacturaDet;


            FacturaCab = await CabceraRepo.findOne({ where: { Numero } })
            FacturaDet = await DetalleRepo.findOne({ where: { Numero } })

            // Validamos si el producto esta en la base de datos
            if (FacturaCab && FacturaDet) {
                return resp.status(404).json({ mensaje: 'La factura ya existe en la base de datos' })
            }

            //Creamos el nuevo producto
            let CabFactura = new Cabecera_Factura();
            let DetFactura = new Detalle_Factura();

            CabFactura.Numero = Numero;
            CabFactura.Fecha = Fecha;
            CabFactura.Ruc_Cliente = Ruc_Cliente;
            CabFactura.CodigoProveedor = CodigoProveedor;
            DetFactura.Numero = Numero;
            DetFactura.Cantidad = Cantidad;
            DetFactura.producto = Codigo_Productos;
            //Guardamos
            await CabceraRepo.save(CabFactura);
            await DetalleRepo.save(DetFactura);
            return resp.status(200).json({ mensaje: 'Producto Creado' });

        } catch (error) {
            return resp.status(400).json({ mensaje: error })
        }

    }

    static update = async (req: Request, resp: Response) => {

        let numero 
        numero = parseInt(req.params["numero"]);
        try {

            const { Numero, Fecha, Ruc_Cliente, CodigoProveedor, Cantidad, Codigo_Productos } = req.body;
            //ValCodigo_Productoamos los datos de entrada
            if (!Numero) {
                return resp.status(404).json({ mensaje: 'Debe indicar el Numero' })
            }
            if (!Fecha) {
                return resp.status(404).json({ mensaje: 'Debe indicar la fecha' })
            }
            if (!Ruc_Cliente) {
                return resp.status(404).json({ mensaje: 'Debe indicar el Ruc_Cliente' })
            }
            if (!CodigoProveedor) {
                return resp.status(404).json({ mensaje: 'Debe indicar el CodigoProveedor' })
            }
            if (Cantidad < 0) {
                return resp.status(404).json({ mensaje: 'Debe indicar la Cantidad mayor que 0' })
            }
            if (!Codigo_Productos) {
                return resp.status(404).json({ mensaje: 'Debe indicar el Codigo_Productos' })
            }


            // Validaciones de reglas de negocio
            const CabeaRepo = AppDataSource.getRepository(Cabecera_Factura);
            const DetaRepo = AppDataSource.getRepository(Detalle_Factura);


            //Buscamoms el producto en la base de datos, para ver si existe
            //Creamos una variable diciendo que va a ser de tipo Producto.
            let Cab: Cabecera_Factura;
            let Det: Detalle_Factura;
            try {
                //ELegimos metodo findOneOrFail para buscar el id y si no lo encuentra.
                //Va a producir un error y el catch lo va a capturar ese error
                Cab = await CabeaRepo.findOneOrFail({ where: { Numero : numero } })
                Det = await DetaRepo.findOneOrFail({ where: { Numero : numero} })

            } catch (error) {
                return resp.status(404).json({ mensaje: 'No existe el producto' })
            }

            Cab.Numero = Numero;
            Cab.Fecha = Fecha;
            Cab.Ruc_Cliente = Ruc_Cliente;
            Cab.CodigoProveedor = CodigoProveedor;
            Det.Numero = Numero;
            Det.Cantidad = Cantidad;
            Det.producto = Codigo_Productos;



            try {
                await CabeaRepo.save(Cab)
                await DetaRepo.save(Det)

                return resp.status(200).json({ mensaje: 'Se guardo correctamente' })
            } catch (error) {
                return resp.status(400).json({ mensaje: error})
            }



        } catch (error) {
            return resp.status(404).json({ mensaje: error.error })
        }


    }

    static delete = async (req: Request, resp: Response) => {

        let Numero;
        try {
            Numero = parseInt(req.params["numero"]);
            if (!Numero) {
                return resp.status(400).json({ mensaje: 'Debe indicar el numero' })
            }

            const DetRepo = AppDataSource.getRepository(Detalle_Factura);
            let Fac;
            try {
                Fac = await DetRepo.findOne({ where: { Numero } })
            } catch (error) {
                return resp.status(404).json({ mensaje: 'No se encuentra en la base de datos' })
            }
            try {
                await DetRepo.delete(Fac)
                return resp.status(200).json({ mensaje: 'Se elimino correctamente' })
            } catch (error) {
                return resp.status(400).json({ mensaje: 'No se pudo eliminar' })
            }

        } catch (error) {
            return resp.status(404).json({ mensaje: 'No se pudo eliminar' })
        }




    }
}

export default FacturaController;