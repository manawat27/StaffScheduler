import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', unique: true, nullable: false })
  name: string;

  @Column({ name: 'assets_folder', nullable: false })
  assets_folder: string;

  @Column({ type: 'jsonb', name: 'theme', nullable: true })
  theme: any;

  @Column({ name: 'who_created', nullable: true })
  who_created: string;

  @CreateDateColumn({ name: 'when_created' })
  when_created: Date;

  @Column({ name: 'who_updated', nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: 'when_updated' })
  when_updated: Date;
}
