import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  paymentGatawayURI = environment.paymentGatawayURI;
  id_les :any = false;
  id_pad: any = false;
  partner: any = false;
  uid: string = '';
  user: any;
  dataForm = this.formBuilder.group({
        user_name: ['', Validators.required],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        medical_conditions: [false, Validators.required],
        has_current_lesions: [false, Validators.required],
        previous_illness: ['', Validators.required],
        lesions: ['', Validators.required]
      });
  dataForm2 = this.formBuilder.group({
    user_name: ['', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    medical_conditions: [false, Validators.required],
    has_current_lesions: [false, Validators.required],
    previous_illness: ['', Validators.required],
    lesions: ['', Validators.required]
  })

  constructor(private auth : AngularFireAuth ,private data: DataService, private formBuilder: FormBuilder, private activateRoute: ActivatedRoute, private router: Router){

  }
    async ngOnInit(){
    const params = await firstValueFrom(this.activateRoute.params);
    if(!params['reload']){
      this.router.navigate(['form?relod=1']);
    }
    this.auth.user
    .subscribe( async user => {
      // this.dataForm.controls.uid.patchValue(user!.uid);
      this.uid = user!.uid;
      this.user = await lastValueFrom(this.data.getAccount(user?.uid));
      if(this.user?.current_subscription == "PREMIUM_PARTNERS"){
        this.partner = true;
      }

    })

  }
  fnPad(){
    this.id_pad = this.id_pad == false ? true : false;
    if(this.id_pad == 1 && this.user.current_subscription == "BASIC"){
      Swal.fire({
        title: 'Es necesario obtener una suscripción Premium',
        text: "¿Gustas que la cambiemos?",
        icon: 'warning',
        showDenyButton: true,
        denyButtonColor: 'green',
        denyButtonText: 'Whatsapp',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, por favor!'
      }).then((result) => {

        if (result.isConfirmed) {
          if(this.user.current_subscription == "BASIC"){
            const data = {
              'uid': this.uid,
              'plan': 'PREMIUM'
            };

            this.data.changePlan(data)
            .subscribe(async (res:any) => {

            });
          }
          Swal.fire(
            'Cambiado!',
            'Tu suscripción ahora es premium.',
            'success'
          )
        }
        else if(result.isDenied){
          window.open('https://api.whatsapp.com/send?phone='+environment.WhatsAppPhone+'&text="Me gustaría me atendieran pues cuento con padecimientos de salud"');
        }
        else{

          this.id_pad = false;
        }
      })
    }
  }
  fnLes(){
    this.id_les = this.id_les == false ? true : false;
    if(this.id_les == 1 && this.user.current_subscription == "BASIC"){
      Swal.fire({
        title: 'Es necesario obtener una suscripción Premium',
        text: "¿Gustas que la cambiemos?",
        icon: 'warning',
        showDenyButton: true,
        denyButtonText: 'Whatsapp',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, por favor!'
      }).then((result) => {
        if (result.isConfirmed) {
          if(this.user.current_subscription == "BASIC"){
            const data = {
              'uid': this.uid,
              'plan': 'PREMIUM'
            };

            this.data.changePlan(data)
            .subscribe(async (res:any) => {

            });
          }
          Swal.fire(
            'Cambiado!',
            'Tu suscripción ahora es premium.',
            'success'
          )
        }
        else if(result.isDenied)
        {
          window.open('https://api.whatsapp.com/send?phone='+environment.WhatsAppPhone+'&text="Me gustaría me atendieran pues cuento con padecimientos de salud"');
        }
        else{

          this.id_les = false;
        }
      })
    }
  }

  onSubmit(){
    const data = {
      uid: this.uid,
      users : [this.dataForm.value]
    }

    if(this.partner) {
      data.users.push(this.dataForm2.value);
    }

    this.data.registerAccountUser(data)
    .subscribe((res:any) => {
      if (res.status === 'success') {
       window.open(this.paymentGatawayURI + "/?uid=" + data.uid, "_SELF");
      }
      else {
        window.open("https://www.befit4u.com.mx/planes", "_SELF");
      }
    }, (error) => {
      console.log('error:', error);
      this.router.navigate(['/']);
    });

  }

  verify(data : any){

    const user_name = data.user_name;
    this.data.verifyUser(user_name)
    .subscribe(async (res:any) => {

      if(res.username_in_use == true){
        this.dataForm.value.user_name = "";
        Swal.fire(
          {
          icon: 'error',
          title: 'Lo sentimos, el nombre de usuario ya esta en uso',
          text: 'Favor de cambiar el nombre de usuario'
         }
        )
      }

    })
  }

}
