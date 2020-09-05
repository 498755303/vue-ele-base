
import column from "@/util/decorate/column.ts";
export class Pagination {
  @column
  currentPage: number;

  @column
  pageSize: number;
}