import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Proveedor } from "./Proveedor";
import { Cliente } from "./Cliente";
import { Vendedor } from "./Vendedor";
import { Detalle_Factura } from "./Detalle_Factura";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Cabecera_Factura {
    //PrimaryColumn es para decirle que va a ser una llave primaria
    //PrimaryGeneratedColumn es para decirle que va a ser una llave primaria y que va a ser autoicrementar 
    @PrimaryColumn({type: 'int', unique: true})
    @IsNotEmpty({ message: 'Debe indicar el Numero'})
    Numero: number;
    @Column({type: 'date',nullable:true})
    Fecha: Date;

    // Cliente
    @ManyToOne(() => Cliente, (cliente) => cliente.facturas)
    @JoinColumn({ name: 'Ruc_Cliente' })
    @IsNotEmpty({ message: 'Debe indicar el Ruc Cliente'})
    cliente: Cliente;
    
    // Vendedor
    @ManyToOne(() => Vendedor, (vendedor) => vendedor.facturas)
    @JoinColumn({ name: 'Codigo_Vendedor' })
    @IsNotEmpty({ message: 'Debe indicar el Codigo Vendedor'})
    vendedor: Vendedor;

    @Column({default:true})
    Estado:boolean;

    // Detalle Factura
    @OneToMany(() => Detalle_Factura, (detalle) => detalle.facturas, {cascade: ['insert', 'update']})
    Fac_detalle:Detalle_Factura[];
}