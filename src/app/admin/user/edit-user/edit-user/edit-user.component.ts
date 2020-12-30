import { Component, OnInit, ViewChild } from '@angular/core';
import {RoleSelectOptions, User, UpdateDeleteModel} from '../../user.model'
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UsersService} from '../../users.service'
import { first, catchError, map } from 'rxjs/operators';
import {FileUploadComponent} from '../../../../file-upload/file-upload/file-upload.component'
import {environment} from '../../../../../environments/environment'

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  
  edit_id :string;
  edit_model : User;
  form: FormGroup;

  @ViewChild(FileUploadComponent, {static: true}) f_upload: FileUploadComponent;

  roles: RoleSelectOptions[] = [
    {value: 'admin', viewValue: 'Admin'},
    {value: 'user', viewValue: 'User'},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private _http: UsersService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {

    this.f_upload.file_info.subscribe(data=>{
      this.setImgUri(data.body.filename);
    })

    this.edit_id  =  this.route.snapshot.params['id'];

    if (!this.edit_id) {
      this.edit_model = new User();
      this.buildForm(this.edit_model);
    }
    else {
      this._http.getUserById(this.edit_id).subscribe(
        product => {
          this.edit_model = product;
          this.buildForm(this.edit_model);
        }
      );
    }
  }

  buildForm(init_model : User) {

    this.form = this.formBuilder.group({
      login: [init_model.login, Validators.required],
      name: [init_model.name, Validators.required],
      password: [init_model.password, Validators.required],
      password_r: [init_model.password, Validators.required],
      email: [init_model.email],
      role: [init_model.role],
      phone: [init_model.phone],
      enabled: [init_model.enabled],
    });
  
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.edit_model.login = this.f.login.value;
      this.edit_model.name = this.f.name.value;
      this.edit_model.password = this.f.password.value;
      this.edit_model.email = this.f.email.value;
      this.edit_model.phone = this.f.phone.value;
      this.edit_model.enabled = this.f.enabled.value;

      if (!this.edit_model._id) {
        this.createNew();
      }
      else {
        this.update();
      }
  }

  createNew(){
    this._http.createUser(this.edit_model)
    .pipe(first())
    .subscribe(
      prod => {
        this.edit_model = prod;
        this.router.navigate([`/edituser/${this.edit_model._id}`]); 
      },
      error => {}
    );
  }

  update() {
    this._http.updateUser(this.edit_model)
    .pipe(first())
    .subscribe(
      res => {
        if (res.ok === 1) {
          this.router.navigate([`/edituser/${this.edit_model._id}`]);   
        }
      },
      error => {}
    );
  }
  setImgUri(filename : string)  {
    this.edit_model.image_uri = `${environment.apiUrl}/images/${filename}`;
   }

}
