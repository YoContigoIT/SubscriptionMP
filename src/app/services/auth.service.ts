import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { FacebookAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithPopup, OAuthProvider, signInWithRedirect } from "firebase/auth";
import { DataService } from './data.service';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  paymentGatawayURI: string = environment.paymentGatawayURI;
  provider : any = new OAuthProvider('apple.com');
  
  constructor(
    public afAuth: AngularFireAuth, private data: DataService, private route: Router // Inject Firebase auth service
  ) {}
  // Sign in with Google
  async GoogleAuth(data:any) {
     await this.AuthLogin(new GoogleAuthProvider(), data);
    this.afAuth.user.subscribe((user) => {

    })
    }
  FacebookAuth(data: any) {
    return this.AuthLogin(new FacebookAuthProvider(), data);
  }
  
  // Auth logic to run auth providers
  AuthLogin(provider:any, inf : any) {
    
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        
        if(result.additionalUserInfo?.isNewUser){
          var datas: any = {
            "email": result.user?.email,
            "uid": result.user?.uid,
            "current_subscription" : inf.current_subscription,
            "subscription_period" : inf.subscription_period
          };
          
          this.data.registerUser(datas)
            .subscribe(async (res) => {
              this.route.navigate(['form']);
              
            })
        }
        else{
          var datas: any = {
            "uid": result.user?.uid,
            "current_subscription" : inf.current_subscription,
            "subscription_period" : inf.subscription_period
          };
          
          this.data.updateUser(datas)
            .subscribe(async (res) => {
              window.open(this.paymentGatawayURI + "/?uid=" + result.user?.uid, "_SELF");
              
            })
        }
        
        
        
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  appleLog(){

    const auth = getAuth();
    this.provider.addScope('email');
    this.provider.addScope('name');
    
    
    signInWithPopup(auth, this.provider)
      .then((result) => {
        // The signed-in user info.
        
        const user = result.user;
        // Apple credential
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const idToken = credential?.idToken;
    
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The credential that was used.
        const credential = OAuthProvider.credentialFromError(error);
    
        // ...
      });
  }

  doRegister(value:any, inf:any) {
    if(!value.new){
      return this.afAuth
      .signInWithEmailAndPassword(value.correo, value.password)
      .then((result) => {
        var datas: any = {
          "uid": result.user?.uid,
          "current_subscription" : inf.current_subscription,
          "subscription_period" : inf.subscription_period
        };
        
        this.data.updateUser(datas)
          .subscribe(async (res) => {
            
            
          })
        window.open(this.paymentGatawayURI + "/?uid=" + result.user?.uid, "_SELF");
      })
      .catch((error) => {
        window.alert(error.message);
      });
    }
    else{
      return this.afAuth
      .createUserWithEmailAndPassword(value.correo, value.password)
      .then((result) => {
        if(result.additionalUserInfo?.isNewUser){
          var datas: any = {
            "email": result.user?.email,
            "uid": result.user?.uid,
            "current_subscription" : inf.current_subscription,
            "subscription_period" : inf.subscription_period
          };
          
          this.data.registerUser(datas)
            .subscribe(async (res) => {
              this.route.navigate(['form']);
              
            })
        }
        
      })
      .catch((error) => {
        window.alert(error.message);
      });
    }
    

  }

}