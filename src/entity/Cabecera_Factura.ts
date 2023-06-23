import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Proveedor } from "./Proveedor";
import { Cliente } from "./Cliente";

@Entity()
export class Cabecera_Factura {
    //PrimaryColumn es para decirle que va a ser una llave primaria
    //PrimaryGeneratedColumn es para decirle que va a ser una llave primaria y que va a ser autoicrementar 
    @PrimaryColumn({type: 'int', unique: true})
    Numero: number;
    @Column({type: 'date',nullable:true})
    Fecha: Date;
    @ManyToOne(() => Cliente, (cliente) => cliente.Ruc_Cliente)
    @JoinColumn({ name: 'Ruc_Cliente' })
    Ruc_Cliente: Cliente;
    
    @ManyToOne(() => Proveedor, (proveedor) => proveedor.Codigo_Proveedor)
    @JoinColumn({ name: 'CodigoProveedor' })
    CodigoProveedor: Proveedor;
}