import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  serverUrl = 'https://www.befit4u.com.mx/admin';
  serverUrl2 = 'http://localhost:8888/mikepolabackend/controller/update_plans.php';
  constructor(private http: HttpClient) { }

  getSubscription(){
    return this.http.get(this.serverUrl + '/json/data_subscriptions.php')   
  }
  registerUser(data: any){
    return this.http.post(this.serverUrl + '/controller/new_user_v2.php', data,  {headers: {"The-Timezone-IANA": Intl.DateTimeFormat().resolvedOptions().timeZone}})
  }
  updateUser(data: any){
    return this.http.post(this.serverUrl + '/controller/update_plans.php', data,  {headers: {"The-Timezone-IANA": Intl.DateTimeFormat().resolvedOptions().timeZone}});
  }
  registerAccountUser(data: any){
    return this.http.post(this.serverUrl + '/controller/new_account_user.php', data,
     {headers: {"The-Timezone-IANA": Intl.DateTimeFormat().resolvedOptions().timeZone}});
  }
  verifyUser(data:any){
    return this.http.get(this.serverUrl + '/json/verify_username.php?user_name=' + data);
  }
  getAccount(data:any){
    return this.http.get(this.serverUrl + '/json/data_account.php?uid=' + data);
  }
  changePlan(data:any){
    return this.http.post(this.serverUrl + '/controller/update_plan_v2.php', data, {headers: {"The-Timezone-IANA": Intl.DateTimeFormat().resolvedOptions().timeZone}});
  }
}
