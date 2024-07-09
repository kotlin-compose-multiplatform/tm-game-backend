import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export const SORT_BY_DATE_ASC = 'sort_by_date_asc';
export const SORT_BY_DATE_DESC = 'sort_by_date_desc';

export default class GetGamesDto {
  @IsNotEmpty()
  @IsNumber()
  page: number;

  size?: number;

  categoryId?: number;

  text?: string;

  @IsNotEmpty()
  @IsIn([SORT_BY_DATE_ASC, SORT_BY_DATE_DESC])
  sort: string;
}
