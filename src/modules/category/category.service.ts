import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CategoryEntity from './entity/category.entity';
import CreateCategoryDto from './dto/create-category.dto';
import { Repository } from 'typeorm';
import UpdateCategoryDto from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async addCategory(
    image: string,
    body: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    try {
      const category = new CategoryEntity();
      category.image = image;
      category.desc_en = body.desc_en;
      category.desc_ru = body.desc_ru;
      category.desc_tm = body.desc_tm;
      category.name_en = body.name_en;
      category.name_ru = body.name_ru;
      category.name_tm = body.name_tm;
      return await this.categoryRepo.save(category);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateCategory(
    id: number,
    body: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    try {
      const category = await this.categoryRepo.findOne({
        where: {
          id: id,
        },
      });
      if (body.desc_en) category.desc_en = body.desc_en;
      if (body.desc_ru) category.desc_ru = body.desc_ru;
      if (body.desc_tm) category.desc_tm = body.desc_tm;
      if (body.name_en) category.name_en = body.name_en;
      if (body.name_ru) category.name_ru = body.name_ru;
      if (body.name_tm) category.name_tm = body.name_tm;
      await this.categoryRepo.update(id, category);
      return category;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async getAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepo.find();
  }

  async deleteCategory(id: number) {
    try {
      return await this.categoryRepo.delete({
        id: id,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async updateCategoryImage(id: number, path: string) {
    try {
      const category = await this.categoryRepo.findOne({
        where: {
          id: id,
        },
      });
      category.image = path;
      await this.categoryRepo.update(id, category);
      return category;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
