import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('market')
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 10, name: 'chain_id' })
  chainId: string;

  @Column({ type: 'bigint', name: 'total_supply_cents' })
  totalSupplyCents: number;

  @Column({ type: 'bigint', name: 'total_borrow_cents' })
  totalBorrowCents: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
