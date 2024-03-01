import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { delay, first} from 'rxjs';

//injecao de dependencia das classes do angular
@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  //criar variavel apontando onde consumir os dados
  private readonly API = 'api/courses';

  //chamada ajax - chamada assincrona pro servidor - injecao de dependencia -
  constructor(private httpClient: HttpClient) { }

  //metodo de retorno de lista de cursos na tela
  list(){
    //observable que retorna um array de cursos
    return this.httpClient.get<Course[]>(this.API)
    .pipe(
      first()
    );
  }

  //carregar por id na tela
  loadById(id: string){
    return this.httpClient.get<Course>(`${this.API}/${id}`);
  }

  //salvar por id na tela
  save(record: Partial<Course>){
    if(record._id) {
      return this.udate(record);
    }
    return this.create(record);
  }

  //criar por id na tela
  private create(record: Partial<Course>){
    return this.httpClient.post<Course>(this.API, record).pipe(first());
  }

  //atualizar por id na tela
  private udate(record: Partial<Course>){
    return this.httpClient.put<Course>(`${this.API}/${record._id}`, record).pipe(first());
  }

  //remover por id na tela
  remove(id: string){
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }
}
