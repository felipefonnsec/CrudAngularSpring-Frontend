import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { FormUtilsService } from '../../../shared/form/form-utils.service';
import { Course } from '../../model/course';
import { Lesson } from '../../model/lesson';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent implements OnInit {

form!: FormGroup;

constructor(private formBuilder: NonNullableFormBuilder,
  private service: CoursesService,
  private snackBar: MatSnackBar,
  private location: Location,
  private rout: ActivatedRoute,
  public formUtils: FormUtilsService){ }

ngOnInit(): void{
  const course: Course = this.rout.snapshot.data['course'];
  this.form = this.formBuilder.group({
    _id: [course._id],
    name: [course.name, [Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)]],
    category: [course.category, Validators.required],
    lessons: this.formBuilder.array(this.retrieveLessons(course), Validators.required)
  });
}

//array de lessons
private retrieveLessons(course: Course){
  const lessons = [];
  if(course?.lessons){
    course.lessons.forEach(lesson => lessons.push(this.createLesson(lesson)));
  } else {
    lessons.push(this.createLesson());
  }
  return lessons;
}

//Componente para criação de aula
private createLesson(lesson: Lesson = {id: '', name: '', youtubeUrl: ''}){
  //grupo de campos(registro da lista)
  return this.formBuilder.group({
    id: [lesson.id],
    name: [lesson.name, [Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)]],
    youtubeUrl: [lesson.youtubeUrl, [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(100)]]
  });
}

//metodo para retorno da lista de licoes no form
getLessonsFormArray(){
  return (<UntypedFormArray>this.form.get('lessons')).controls;
}

//botao de add lesson
addNewLesson(){
  //forcando tipagem push
  const lessons = this.form.get('lessons') as UntypedFormArray;
  lessons.push(this.createLesson());
}

//botao de deletar leson
removeLesson(index:number){
  const lessons = this.form.get('lessons') as UntypedFormArray;
  lessons.removeAt(index);
}

//button de criacao
onSubmite(){
  if(this.form.valid) {
    this.service.save(this.form.value)
    .subscribe(result => this.onSucess(), error => this.onError());
    this.onCancel();
  } else {
    this.formUtils.validateAllFormFields(this.form);
  }
}

//button de cancelar
onCancel(){
  this.location.back();
}

//chamada do pop-up de erro
private onSucess(){
  this.snackBar.open('Salvo com sucesso', '', {duration:7000});
}

//chamada do pop-up de erro
private onError(){
  this.snackBar.open('Erro ao salvar curso', '', {duration:5000});
}
}
