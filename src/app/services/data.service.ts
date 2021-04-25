import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  dialogData: any;
  newList : any ;
  constructor(private httpClient: HttpClient) {
   }

  get data(): any[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllUser(Api_Url:string,methodName:string): void {
    this.httpClient.get<any[]>(Api_Url + '/'+ methodName +'/').subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  addUser(Api_Url:string,methodName:string,user: any):  void {
      this.httpClient.post<any[]>(Api_Url + '/'+ methodName +'/',user).subscribe(data => {

          this.dialogData  =  data ;

    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });

  }

  updateUser(Api_Url:string,methodName:string,paraId:number,user: any): void {
    this.httpClient.put<any[]>(Api_Url + '/'+methodName+'/'+paraId,user).subscribe(data => {
    this.dialogData = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

}
