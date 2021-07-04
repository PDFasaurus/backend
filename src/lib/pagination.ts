import { Request } from '../requests/request.entity';
export const PAGE_SIZE = 20;
export interface IPagination {
  results: Request[],
  total: number,
}
