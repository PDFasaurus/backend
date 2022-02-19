import { CreateDateColumn, UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Template } from '../templates/template.entity';
import { Request } from '../requests/request.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ default: 0 })
  plan: number;

  @Column({ default: 0 })
  subscriptionId: number;

  @Column({ default: 0 })
  balance: number;

  @Column({ nullable: true })
  cancelUrl: string;

  @Column({ nullable: true })
  updateUrl: string;

  @Column({ nullable: true })
  nextBillDate: Date;

  @Column({ nullable: true })
  lastPaymentDate: Date;

  @Column()
  apiKey: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(type => Template, template => template.user)
  templates: Template[];

  @OneToMany(type => Request, request => request.user)
  requests: Request[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
