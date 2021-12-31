export class User {
   _id:string;
   profile:string;
   name:string;
   email:string;
   login:string;
   password:string;
   phone:string;
   role:string;
   image_uri:string;
   enabled:boolean;
   created_at: Date;
   constructor(){
     this.role = 'user';
     this.enabled = true;
     this.phone = '111-222-3333';
     this.login  = 'Login1';   
     this.password  = '1';   
     this.email  = 'aaa@ddd.sss.com';   
     this.name  = 'User name 1';   
   }
}

export class RoleSelectOptions {
   value: string;
   viewValue: string;
 }

 export class UpdateDeleteModel {
   ok: number;
   nModified: string;
   n: number;
 }

 export class UsersPage {
  data:User[];
  total_count:number;
  link: Link;
}

export class Link {
  page:number;
  per_page:number;
  prev:number;
  next:number;
  last:number;
}