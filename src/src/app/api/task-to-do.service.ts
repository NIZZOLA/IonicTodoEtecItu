import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskToDo } from '../model/task-to-do';

@Injectable({
  providedIn: 'root'
})
export class TaskToDoService {

  url = 'https://localhost:44335/api/tasktodo';

  httpOptions = { header: new HttpHeaders({ 'Content-Type' : 'application/json'})};

  constructor(private http: HttpClient) { }

  getOne(id: string) {
    return this.http.get(this.url + '/' + id).toPromise();
  }

  getAll() {
    return this.http.get(this.url).toPromise();

  }

  post(taskName: string) {
    let taskObj = { nome: taskName };
    
    console.log('dentro do post' + taskName);

    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(this.url,JSON.stringify(taskObj), httpOptions).toPromise();
  }

  put(id: string, task: TaskToDo) {

    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.put(this.url + '/' + id, JSON.stringify(task) , httpOptions ).toPromise();
  }

  delete(id: string) {
    return this.http.delete(this.url + '/' + id ).toPromise();
  }

}
