import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

// import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id: ', this.id);
  }
}
