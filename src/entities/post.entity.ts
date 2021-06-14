import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { TagName } from "./tagname.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  imageBanner: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  //===== Foreign key
  @ManyToOne(type => Category, cate => cate.posts, {
    onDelete: 'CASCADE',
  })
  cate: Category;

  @ManyToMany(() => TagName, (tag) => tag.posts)
  @JoinTable({name: 'posts_tags'})
  tags: TagName[];
}