import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import CreateCategoryDto from './dto/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import UpdateCategoryDto from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('add-category')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'upload',
    }),
  )
  addCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateCategoryDto,
  ) {
    return this.categoryService.addCategory(file.path, body);
  }

  @Patch('update-category/:id')
  updateCategory(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoryService.updateCategory(+id, body);
  }

  @Patch('update-category-image/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'upload',
    }),
  )
  updateCategoryImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategoryImage(+id, file.path);
  }

  @Get()
  getAllCategory() {
    return this.categoryService.getAll();
  }

  @Delete('delete-category/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(+id);
  }
}
