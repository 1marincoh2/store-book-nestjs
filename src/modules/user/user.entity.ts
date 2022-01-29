import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  OneToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { UserDetails } from './user.details.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true, length: 25, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToOne((type) => UserDetails, {
    cascade: true,
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'details_id' })
  details: UserDetails;

  @ManyToMany((type) => Role, (role) => role.users, { eager: false })
  @JoinTable()
  roles: Role[];

  @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
  updateAt: Date;
}
