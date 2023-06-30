import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cabecera_Factura } from "../entity/Cabecera_Factura";
import { Detalle_Factura } from "../entity/Detalle_Factura";

class FacturaController {

    static getAll = async (req: Request, resp: Response) => {

        try {
            const repoFac = AppDataSource.getRepository(Cabecera_Factura);
            let lista;
            try {
                lista = await repoFac.find({where: { Estado:true }, relations: { Fac_detalle: { productos: true } } })
            } catch (error) {
                return resp.status(404).json({ mensaje: "No se encontro datos." })
            }
            return resp.status(200).json(lista);
        } catch (error) {
            return resp.status(404).json({ mensaje: "Error al cargar los datos" })
        }
    }

    static getById = async (req: Request, resp: Response) => {

        try {

            const repoFac = AppDataSource.getRepository(Cabecera_Factura);
            let Factura, Numero;
            //Extraemos el id, en fomrato Int
            Numero = parseInt(req.params["numero"]);
            if (!Numero) {
                return resp.status(404).json({ mensaje: 'No se indica el ID' })
            }
            try {
                Factura = await repoFac.findOneOrFail({ where: { Numero,Estado:true }, relations: { Fac_detalle: { productos: true } } })
            } catch (error) {
                return resp.status(404).json({ mensaje: "No se encontro datos." })
            }
            return resp.status(200).json(Factura);
        } catch (error) {
            return resp.status(404).json({ mensaje: "Error al cargar los datos" })
        }
    }

    static add = async (req: Request, resp: Response) => {
        try {
            // Destructuring
            // De esa manera estamos sacando del body esos datos:
            const { Numero, Ruc_Cliente, Codigo_Vendedor, Cantidad, Codigo_Productos } = req.body;

            //Hacemos la instancia del repositorio
            const CabceraRepo = AppDataSource.getRepository(Cabecera_Factura);
            const DetalleRepo = AppDataSource.getRepository(Detalle_Factura);
            let FacturaCab;


            FacturaCab = await CabceraRepo.findOne({ where: { Numero } })

            // Validamos si el producto esta en la base de datos
            if (FacturaCab) {
                return resp.status(404).json({ mensaje: 'La factura ya existe en la base de datos' })
            }

            const Fecha = new Date();
            //Creamos el nuevo producto
            let CabFactura = new Cabecera_Factura();
            let DetFactura = new Detalle_Factura();

            // Cabecera Factura
            CabFactura.Numero = Numero;
            CabFactura.Fecha = Fecha;
            CabFactura.cliente = Ruc_Cliente;
            CabFactura.vendedor = Codigo_Vendedor;
            // Detalle Factura
            DetFactura.Numero = Numero;
            DetFactura.Codigo_Productos = Codigo_Productos;
            DetFactura.Cantidad = Cantidad;

            //Guardamos
            await CabceraRepo.save(CabFactura);
            await DetalleRepo.save(DetFactura);
            return resp.status(200).json({ mensaje: 'Producto Creado' });

        } catch (error) {
            return resp.status(400).json({ mensaje: error })
        }

    }

    static update = async (req: Request, resp: Response) => {

        try {
            const { Ruc_Cliente, Codigo_Vendedor, Cantidad, Codigo_Productos } = req.body;
            let Numero;
            //Extraemos el id, en fomrato Int
            Numero = parseInt(req.params["numero"]);
            // Hacemos la instancia del repositorio
            const CabceraRepo = AppDataSource.getRepository(Cabecera_Factura);
            const DetalleRepo = AppDataSource.getRepository(Detalle_Factura);

            // Buscamos la factura por su número
            const factura = await CabceraRepo.findOne({ where: { Numero, Estado:true} });

            // Validamos si la factura existe en la base de datos
            if (!factura) {
                return resp.status(404).json({ mensaje: 'La factura no existe en la base de datos' });
            }

            // Actualizamos los campos de la factura
            factura.cliente = Ruc_Cliente;
            factura.vendedor = Codigo_Vendedor;

            // Guardamos los cambios en la cabecera de la factura
            await CabceraRepo.save(factura);

            // Buscamos el detalle de la factura
            const detalle = await DetalleRepo.findOne({ where: { Numero } });

            // Validamos si el detalle existe en la base de datos
            if (!detalle) {
                return resp.status(404).json({ mensaje: 'El detalle de la factura no existe en la base de datos' });
            }

            // Buscamos el detalle de la factura por su número de factura y lo actualizamos
            await DetalleRepo.createQueryBuilder()
                .update(Detalle_Factura)
                .set({ Codigo_Productos, Cantidad })
                .where("Numero = :Numero", { Numero })
                .execute();

            return resp.status(200).json({ mensaje: 'Factura actualizada correctamente' });
        } catch (error) {
            return resp.status(400).json({ mensaje: error });
        }


    }

    static deleteDetalle = async (req: Request, resp: Response) => {

        let Numero;
        try {
            Numero = parseInt(req.params["numero"]);
            if (!Numero) {
                return resp.status(400).json({ mensaje: 'Debe indicar el numero' })
            }

            const DetRepo = AppDataSource.getRepository(Detalle_Factura);
            let Fac;
            try {
                Fac = await DetRepo.findOneOrFail({ where: { Numero }})
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
            return resp.status(404).json({ mensaje: 'Ocurrio un problema al momento de eliminar' })
        }

    }

    static delete = async (req: Request, resp: Response) => {

        try {
            let Numero;
            Numero = parseInt(req.params["numero"]);
            if (!Numero) {
                return resp.status(400).json({ mensaje: 'Debe indicar el numero' })
            }

            const CabRepo = AppDataSource.getRepository(Cabecera_Factura);
            // Buscamos la factura por su número
            const Cab = await CabRepo.findOne({ where: { Numero, Estado: true } });

            // Validamos si la factura existe en la base de datos
            if (!Cab) {
                return resp.status(404).json({ mensaje: 'La factura no existe en la base de datos' });
            }
            try {
                Cab.Estado = false;
                await CabRepo.save(Cab);
                return resp.status(200).json({ mensaje: 'Se elimino correctamente' })
            } catch (error) {
                return resp.status(400).json({ mensaje: 'No se pudo eliminar' })
            }

        } catch (error) {
            return resp.status(404).json({ mensaje: 'Ocurrio un problema al momento de eliminar' })
        }
    }
}

export default FacturaController;
