import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, forkJoin, lastValueFrom } from 'rxjs';
import { DataService } from './services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  paymentGatawayURI = environment.paymentGatawayURI;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private dataService: DataService,
    private activatedRouter: ActivatedRoute
  ){}

  async ngOnInit() {

    const signOut = new URLSearchParams(window.location.search).get('singout');
    console.log('location:', window.location);

    if (signOut) {
      await this.afAuth.signOut();
    }
    this.afAuth.user
    .subscribe(async (user) => {
      if(user){
        const users: any = await lastValueFrom(this.dataService.getDataUsers(user!.uid));
        if(users.length) {
          window.open(this.paymentGatawayURI + "/?uid=" + user!.uid, "_SELF");
        } else {
          this.router.navigate(['/form']);
        }


      }

    })
  }

  title = 'subscriptionMP';
}
