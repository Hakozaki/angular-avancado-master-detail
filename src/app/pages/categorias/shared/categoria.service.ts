import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Categoria } from './categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private api: string = "https://localhost:8000/api/categorias";

  constructor(private http: HttpClient) { }

  index(): Observable<Categoria[]> {
    return this.http.get(this.api).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategorias)
    )
  }

  show(id: number): Observable<Categoria> {
    const url = `${this.api}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategoria)
    )
  }

  store(categoria: Categoria): Observable<Categoria> {
    return this.http.post(this.api, categoria).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategoria)
    )
  }

  update(categoria: Categoria): Observable<Categoria> {
    const url = `${this.api}/${categoria.id}`;

    return this.http.put(url, categoria).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategoria)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.api}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }




  //METODOS PRIVADOS
  private jsonDataToCategorias(jsonData: any[]): Categoria[] {
    const categorias: Categoria[] = [];
    jsonData.forEach(element => categorias.push(element as Categoria));
    return categorias;
  }

  private jsonDataToCategoria(jsonData: any): Categoria {
    return jsonData as Categoria;
  }

  private handleError(erro: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO =>", erro);
    return throwError(erro);
  }
}
