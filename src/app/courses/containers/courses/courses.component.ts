import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, first, of, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {

  courses$: Observable<Course[]> | null = null;

  //forma de istanciar o courses
  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
    ){
    this.refresh();
  }

  refresh(){
    this.courses$ = this.coursesService.list()
    .pipe(
      first(),
      tap(courses => console.log(courses)),
      catchError(error => {
        this.onError('Erro ao carregar cursos!')
        return of([])
      })
    );
  }

  //tratamento de erro
  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  //campos referente a acao (adicionar)
  onAdd() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  //campos referente a acao (editar)
  onEdit(course: Course){
    this.router.navigate(['edit', course._id], {relativeTo: this.route});
  }

  onRemove(course: Course){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.coursesService.remove(course._id).subscribe(
          () => {
            this.refresh();
            this.snackBar.open('Removido com sucesso', '', {
              duration:7000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          },
          error => this.onError('Erro ao remover curso')
        );
      }
    });
  }

}
