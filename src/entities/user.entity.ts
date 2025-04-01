import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullname: string;

    @Column()
    email: string;

    // Por motivos de simplicidad, vamos a guardar la contraseña en texto plano
    @Column()
    pass: string;

    @OneToMany(() => Task, (task) => task.owner)
    tasks: Task[];

    constructor(createUserDto?: CreateUserDto) {
        this.email = createUserDto?.email;
        this.pass = createUserDto?.pass;
        this.fullname = createUserDto?.fullname;
    }
}
