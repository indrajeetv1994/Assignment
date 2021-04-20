import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {DataService} from './services/data.service';
import {HttpClient} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {User} from './models/user';
import {DataSource} from '@angular/cdk/table';
import {AddComponent} from './dialogs/add/add.component';
import {EditComponent} from './dialogs/edit/edit.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns = ['id', 'userId','title', 'body','actions'];
  tempDatabase: DataService | null;
  dataSource: TempDataSource | null;
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,
    public dialogService: MatDialog,
    public dataService: DataService) {}

@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild('filter',  {static: true}) filter: ElementRef;

ngOnInit() {
  this.loadData();
}

reload() {
  this.loadData();
}

openAddDialog() {
  const dialogRef = this.dialogService.open(AddComponent, {
    data: {user: {} }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 1) {
      this.tempDatabase.dataChange.value.push(this.dataService.getDialogData());
      this.refreshTable();
    }
  });
}

startEdit(i: number, id: number,userId: number, title: string, body: string) {
  this.id = id;
  this.index = i;
  console.log(this.index);
  const dialogRef = this.dialogService.open(EditComponent, {
    data: {id: id,userId:userId ,title: title, body: body}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 1) {
      const foundIndex = this.tempDatabase.dataChange.value.findIndex(x => x.id === this.id);
      this.tempDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
      this.refreshTable();
    }
  });
}

private refreshTable() {
  this.paginator._changePageSize(this.paginator.pageSize);
}

public loadData() {
  this.tempDatabase = new DataService(this.httpClient);
  this.dataSource = new TempDataSource(this.tempDatabase, this.paginator, this.sort);
  fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
}
}

export class TempDataSource extends DataSource<User> {
_filterChange = new BehaviorSubject('');

get filter(): string {
  return this._filterChange.value;
}

set filter(filter: string) {
  this._filterChange.next(filter);
}

filteredData: User[] = [];
renderedData: User[] = [];

constructor(public _tempDatabase: DataService,
            public _paginator: MatPaginator,
            public _sort: MatSort) {
  super();
  this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
}
connect(): Observable<User[]> {
  const displayDataChanges = [
    this._tempDatabase.dataChange,
    this._sort.sortChange,
    this._filterChange,
    this._paginator.page
  ];

  this._tempDatabase.getAllUser();

  return merge(...displayDataChanges).pipe(map( () => {
     this.filteredData = this._tempDatabase.data.slice().filter((user: User) => {
        const searchStr = (user.id + user.userId + user.title + user.body).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
     const sortedData = this.sortData(this.filteredData.slice());
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    }
  ));
}
disconnect() {}
sortData(data: User[]): User[] {
  if (!this._sort.active || this._sort.direction === '') {
    return data;
  }

  return data.sort((a, b) => {
    let propertyA: number | string = '';
    let propertyB: number | string = '';

    switch (this._sort.active) {
      case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
      case 'userId': [propertyA, propertyB] = [a.userId, b.userId]; break;
      case 'title': [propertyA, propertyB] = [a.title, b.title]; break;
      case 'body': [propertyA, propertyB] = [a.body, b.body]; break;
    }

    const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
    const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

    return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
  });
}
}
