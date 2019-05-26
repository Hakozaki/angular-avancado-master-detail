import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../shared/categoria.service';
import { Categoria } from '../shared/categoria.model';


@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.css']
})
export class CategoriaListComponent implements OnInit {

  public categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.categoriaService.index()
      .subscribe(
        data => this.categorias = data,
        error => console.log('erro', error)
      );
  }

  deleteCategoria(categoria: Categoria) {

    const deletar = confirm('Excluir?');

    if (deletar) {
      this.categoriaService.delete(categoria.id).
        subscribe(
          () => this.categorias = this.categorias.filter(element => element != categoria),
          error => console.log("erro ao tentar excliur", error)
        )
    }

  }

}
