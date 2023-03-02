import { Component } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private afAuth: AngularFireAuth, private router: Router){
    this.afAuth.user
    .subscribe((user) => {
      if(user){
        console.log(user);
        
        this.router.navigate([]);
      }
      
    })
  }

  title = 'subscriptionMP';
}
