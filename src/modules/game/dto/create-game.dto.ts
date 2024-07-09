import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title_tm: string;

  @IsString()
  @IsNotEmpty()
  title_en: string;

  @IsString()
  @IsNotEmpty()
  title_ru: string;

  @IsString()
  @IsNotEmpty()
  desc_tm: string;

  @IsString()
  @IsNotEmpty()
  desc_en: string;

  @IsString()
  @IsNotEmpty()
  desc_ru: string;

  @IsString()
  @IsNotEmpty()
  site_url: string;

  @IsNumber()
  @IsNotEmpty()
  star: number;

  @IsString()
  @IsNotEmpty()
  steam_id: string;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}
