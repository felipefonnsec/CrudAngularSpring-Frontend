import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {

  //injetando o tipo na variavel data, para pop up de erro
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}

}
