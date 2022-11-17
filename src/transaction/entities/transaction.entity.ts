import { Account } from 'src/account/entities/account.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  value: number;

  @ManyToOne(() => Account, {
    nullable: false,
  })
  @JoinTable()
  debitedAccountId: Account;

  @ManyToOne(() => Account, {
    nullable: false,
  })
  @JoinTable()
  creditedAccountId: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
