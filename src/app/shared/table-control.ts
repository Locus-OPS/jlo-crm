export class TableControl {

  pageSizeOptions = [5, 10, 20];
  sortColumn: string;
  sortDirection: string;
  pageSize = 5;
  pageNo = 0;
  total = 0;

  searchFunc: Function;

  constructor(
    searchFunc: Function
  ) {
    this.searchFunc = searchFunc;
  }

  resetPage() {
    this.pageNo = 0;
  }

  onSort(e) {
    this.sortColumn = e.active;
    this.sortDirection = e.direction;
    this.searchFunc();
  }

  onPage(e) {
    this.pageNo = e.pageIndex;
    this.pageSize = e.pageSize;
    this.searchFunc();
  }

}
