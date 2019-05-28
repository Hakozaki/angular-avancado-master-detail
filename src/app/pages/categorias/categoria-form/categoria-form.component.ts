import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { Categoria } from '../shared/categoria.model'
import { CategoriaService } from '../shared/categoria.service'

import { switchMap } from 'rxjs/operators'
import toastr from 'toastr'

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoriaForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  categoria: Categoria = new Categoria();

  constructor(
    private categoriaServcice: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildForm();
    this.loadForm();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'novo') {
      this.createCategoria();
    } else {
      this.updateCategoria();
    }
  }



  //METODOS PRIVADOS
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "novo") {
      this.currentAction = "novo";
    } else {
      this.currentAction = "editar";
    }
  }

  private buildForm() {
    this.categoriaForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3)]],
      descricao: [null]
    });
  }

  private loadForm() {
    if (this.currentAction == "editar") {
      this.route.paramMap
        .pipe(
          switchMap(params => this.categoriaServcice.show(+params.get("id")))
        )
        .subscribe(
          (categoria) => {
            this.categoria = categoria;
            this.categoriaForm.patchValue(this.categoria);
          },
          (error) => console.log('ERRO NO FORM', error)
        )
    }
  }

  private setPageTitle() {
    if (this.currentAction == "novo") {
      this.pageTitle = "CADASTRO DE NOVA CATEGORIA"
    } else {
      const catNome = this.categoria.nome || ""
      this.pageTitle = `Editando categoria: ${catNome}`
    }
  }

  private createCategoria() {
    const categoria: Categoria = Object.assign(new Categoria(), this.categoriaForm.value);

    this.categoriaServcice.store(categoria)
      .subscribe(
        (categoria) => this.actionForSucess(categoria),
        (error) => this.actionForError(error)
      );
  }

  private updateCategoria() {
    const categoria: Categoria = Object.assign(new Categoria(), this.categoriaForm.value);

    this.categoriaServcice.update(categoria)
      .subscribe(
        (categoria) => this.actionForSucess(categoria),
        (error) => this.actionForError(error)
      )
  }

  private actionForSucess(categoria: Categoria) {
    toastr.success("Objeto salvo");
    this.router.navigateByUrl("categorias", { skipLocationChange: true })
      .then(
        () => this.router.navigate(["categorias", categoria.id, "edit"])
      );
  }

  private actionForError(error: any) {
    toastr.error("Objeto salvo");
    this.submittingForm = false;

  }
}



