import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  //validando todos os campos
  validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray){
    Object.keys(formGroup.controls).forEach( field => {
      const control = formGroup.get(field);

      if(control instanceof UntypedFormControl){
        control.markAsTouched({onlySelf: true});
      } else if(control instanceof UntypedFormGroup || control instanceof UntypedFormArray){
        control.markAsTouched({onlySelf: true});
        this.validateAllFormFields(control);
      }
    });
  }

  getErrorMessage(formGroup: UntypedFormGroup,fieldName: string){
    const field = formGroup.getError(fieldName);
    return this.getErrorMessageFormField(field);
  }

  getErrorMessageFormField(field: UntypedFormControl){

    if(field?.hasError('required')){
      return 'Campo obrigatorio!';
    }

    if(field?.hasError('minLength')){
      const requiredLength = field.errors ? field.errors['requiredLength'] : 5;
      return `Tamanho mínimo precisa ser de ${requiredLength} caracteres`;
    }
    if(field?.hasError('maxLength')){
      const requiredLength = field.errors ? field.errors['requiredLength'] : 200;
      return `Tamanho máximo precisa ser de ${requiredLength} caracteres`;
    }

    return 'Campo invalido';
  }

  getFormArrayFieldErrorMessage(formGroup: UntypedFormGroup, formArrayName: string, fieldName: string, index: number){
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;
    const field = formArray.controls[index].get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFormField(field);
  }

  isFormArrayRequired(FormGroup: UntypedFormGroup, formArrayName: string){
    const formArray = FormGroup.get(formArrayName) as UntypedFormArray;
    return !formArray.valid && formArray.hasError('required') && formArray.touched;
  }
}
