import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./Producto";
import { Cabecera_Factura } from "./Cabecera_Factura";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Detalle_Factura {
  @PrimaryGeneratedColumn()
  Numero: number;

  @PrimaryColumn()
  @IsNotEmpty({ message: 'Debe indicar el Codigo Producto'})
  Codigo_Productos: number;

  @Column({ type: 'int', nullable: true })
  @IsNotEmpty({ message: 'Debe indicar la cantidad'})
  Cantidad: number;

  @ManyToOne(() => Producto, (producto) => producto.facturas)
  @JoinColumn({ name: 'Codigo_Productos' })
  productos: Producto;

  @ManyToOne(() => Cabecera_Factura, (factura) => factura.Fac_detalle)
  @JoinColumn({ name: 'Numero' })
  facturas: Cabecera_Factura;
}