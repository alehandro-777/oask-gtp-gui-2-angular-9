import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputDataService {
  private inputChangedSubject: BehaviorSubject<any>;
  public inputChangeAsObservable: Observable<any>;

  private calcSavedSubject: BehaviorSubject<any>;
  public calcSavedAsObservable: Observable<any>;

  private updateClickSubject: BehaviorSubject<any>;
  public updateClickAsObservable: Observable<any>;

  private exportClickSubject: BehaviorSubject<any>;
  public exportClickAsObservable: Observable<any>;

  private addClickSubject: BehaviorSubject<any>;
  public addClickAsObservable: Observable<any>;


  constructor() {
    this.inputChangedSubject = new BehaviorSubject<any>({}); 
    this.inputChangeAsObservable = this.inputChangedSubject.asObservable();
    
    this.calcSavedSubject = new BehaviorSubject<any>({}); 
    this.calcSavedAsObservable = this.calcSavedSubject.asObservable(); 

    this.updateClickSubject = new BehaviorSubject<any>({}); 
    this.updateClickAsObservable = this.updateClickSubject.asObservable();
  
    this.exportClickSubject = new  BehaviorSubject<any>({}); 
    this.exportClickAsObservable = this.exportClickSubject.asObservable();

    this.addClickSubject = new  BehaviorSubject<any>({}); 
    this.addClickAsObservable = this.addClickSubject.asObservable();
  
  }
  //1
  public get inputChangedSubjValue(): any {    
    return this.inputChangedSubject.value;    
  }
  inputChanged(payload : any) {
      this.inputChangedSubject.next(payload);
  }
 
  //2
  public get calcSavedSubjectValue(): any {    
    return this.calcSavedSubject.value;    
  }
  calcSaved(payload : any) {
      this.calcSavedSubject.next(payload);
  }

  //3
  public get updateClickSubjectValue(): any {    
    return this.updateClickSubject.value;    
  }  
  updateClicked(payload : any) {
      this.updateClickSubject.next(payload);
  }

  //4
  public get exportClickSubjectValue(): any {    
    return this.exportClickSubject.value;    
  }  
  exportClicked(payload : any) {
      this.exportClickSubject.next(payload);
  }
  
  //5
  public get addClickSubjectValue(): any {    
    return this.addClickSubject.value;    
  }  

  addClicked(payload : any) {
      this.addClickSubject.next(payload);
  }

}
