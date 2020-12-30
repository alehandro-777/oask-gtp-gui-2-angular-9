import { Component, Input } from '@angular/core';
import { FormGroup }        from '@angular/forms';

import { InputCfg }     from '../input-cfg-model';

@Component({
  selector: 'dyn-form-input',
  templateUrl: './input.component.html'
})
export class HtmlInputComponent {
  @Input() input: InputCfg;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.input.name].valid; }
}
