import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('photos')
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'timestamp'})
    publishedDate: string;

    @Column({ type: 'text', nullable: false })
    imageUrl: string;

    @Column({ type: 'text', nullable: false })
    tags: string;
}