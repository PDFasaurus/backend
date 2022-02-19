import { CreateDateColumn, UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Request } from '../requests/request.entity';

@Entity()
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  uuid: string;

  @Column({ default: '' })
  content: string;

  @Column({ default: false })
  deleted: boolean;

  @ManyToOne(type => User, user => user.templates)
  user: User;

  @OneToMany(type => Request, request => request.user)
  requests: Request[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
