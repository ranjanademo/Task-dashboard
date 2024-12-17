import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _httpClient:HttpClient) { }

  baseURL:String="http://localhost:3000/users";

  fetchAllUsers():Observable<User[]>{
    return this._httpClient.get<User[]>(`${this.baseURL}`);
  }

  createUsers(data:User){
    return this._httpClient.post<User>(`${this.baseURL}`,data);
  }

  updateUsers(data:User){
    return this._httpClient.put<User>(`${this.baseURL}/${data.id}`,data);
  }

  deleteUsers(id:Number): Observable<{}>{
    return this._httpClient.delete<User>(`${this.baseURL}/${id}`);
  }
}
