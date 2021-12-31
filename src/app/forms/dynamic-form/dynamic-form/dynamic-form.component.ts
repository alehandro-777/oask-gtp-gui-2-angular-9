import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators }                 from '@angular/forms';
import { InputCfg } from '../../input-cfg-model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  constructor() { }

    @Input() title: string;
    @Input() inputs: InputCfg[];
    
    @Output() okClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() cancelClicked: EventEmitter<any> = new EventEmitter<any>();

    form: FormGroup;  

  ngOnInit() {
    this.form = this.toFormGroup( this.inputs );
  }
  
  onNoClick(): void {
    this.cancelClicked.emit();
  }

  onSubmit() {
    this.okClicked.emit(this.form.value);
  }

  toFormGroup(questions: InputCfg[] ) {
    let group: any = {};

    questions.forEach(html_input => {
      group[html_input.name] = new FormControl(html_input.value || '', Validators.required)
    });
    return new FormGroup(group);
  }

}

