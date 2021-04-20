import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../models/user';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com';
  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  dialogData: any;
  newList : any ;
  constructor(private httpClient: HttpClient) {
   }

  get data(): User[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllUser(): void {
    this.httpClient.get<User[]>(this.API_URL + '/posts/').subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  addUser(user: User):  void {
      this.httpClient.post<User[]>(this.API_URL + '/posts/',user).subscribe(data => {

          this.dialogData  =  data ;

    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });

  }

  updateUser(user: User): void {
    this.httpClient.put<User[]>(this.API_URL + '/posts/'+user.id,user).subscribe(data => {
    this.dialogData = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

}
