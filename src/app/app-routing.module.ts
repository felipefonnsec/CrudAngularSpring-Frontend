import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Criacao de rotas: verificando o caminho e criando rota
const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'courses'},
  //import do modulo filho(caminho para o modulo de cursos) criado com Lazy load
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
