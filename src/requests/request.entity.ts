import { CreateDateColumn, UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Template } from '../templates/template.entity';
import { User } from '../users/user.entity';

@Entity()
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  apiKey: string;

  @ManyToOne(type => User, user => user.requests)
  user: User;

  @ManyToOne(type => Template, template => template.requests)
  template: Template;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
