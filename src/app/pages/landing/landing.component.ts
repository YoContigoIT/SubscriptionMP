import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AnonymousSubject } from 'rxjs/internal/Subject';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  @ViewChild('modal')
  modal!: ElementRef;
  subscriptions : any = [];
  inf : any = {
    "current_subscription" : "",
    "subscription_period" : ""
  };
  loginForm = this.formBuilder.group({
    correo: ['', Validators.required],
    password: ['', Validators.required],
    new: [true]
  })

  heightLine : number = 68;
  // getScreenWidth: number = window.innerWidth;

  constructor(private dataServices: DataService, public authService: AuthService, private formBuilder: FormBuilder){}
  async ngOnInit() {
     this.subscriptions = await firstValueFrom(this.dataServices.getSubscription());
    console.log('en ngOnInit subscriptions:', this.subscriptions);
  }
  checkPass(event:any){

    if(this.loginForm.value.password != event.target.value){

      this.loginForm.value.password = "";
      event.target.value = "";
      Swal.fire({
        'title': "Contraseñas diferentes"
      })
    }

  }
  ngOnDestroy(){

    this.modal.nativeElement.click();
  }
  onSubmit(){
  }

  fnGoogle(){
    this.modal.nativeElement.click();
    this.authService.GoogleAuth(this.inf);
  }

  fnFace(){
    this.modal.nativeElement.click();
    this.authService.FacebookAuth(this.inf);
  }

  fnApple(){
    this.modal.nativeElement.click();
    this.authService.appleLog();
  }

  fnEmail(){
    this.modal.nativeElement.click();
    this.authService.doRegister(this.loginForm.value, this.inf)
  }
  contract(period: any){
    this.inf.current_subscription = period.subscription_id;
    this.inf.subscription_period = period.selected_period.period;
  }

  calculateHeightPerks(numPerks: number){
    // console.log('h:', this.getScreenWidth);
    const height = this.heightLine * numPerks;
    if(window.innerWidth < 550){
      // console.log('return height resposivo: ', height);
      return 'height: ' + height + 'px;';
    }
    return '';
  }

  calculateHeightPlan(numPerks: number){
    const height = ((this.heightLine * numPerks) + 168 + 36 + 80);
    if(window.innerWidth < 550){
      return 'height: ' + height + 'px;';
    }
    return '';
  }
}
