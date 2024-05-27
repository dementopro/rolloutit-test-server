import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'date'})
    publishedDate: string;

    @Column({ type: 'text', nullable: false })
    imageUrl: string

    @Column({ type: 'simple-array', nullable: false })
    tags: string[]
}