import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class UserProvider {

  public url: any;

  constructor(
    public http: HttpClient,
    // @Inject('API_URL') private url: string
  ) {
    console.log('Hello UserProvider Provider');
  }

  registerDevice(userId, deviceToken, isAccept) {
    return new Promise((resolve, reject) => {
      let data = {
        user_id: userId,
        device_token: deviceToken,
        is_accept: isAccept,
      };
      this.http.post(this.url + '/fcm/registerdevice', data).subscribe(data => {
        resolve(data)
      }, err => {
        reject(err)
      });
    });
  }

  register(fname: string, username: string, password: string, email: string, mobile: string) {
    return new Promise((resolve, reject) => {
      const data = {
        fname: fname,
        uname: username,
        upass: password,
        uemail: email,
        umobile: mobile
      }
      this.http.post('http://202.29.52.232/service/taksmog_register.php', data)
        .subscribe((res) => {
          resolve(res);
        }, err => {
          reject(err);
        })
    })
  }

  postMobileReport(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/tak_mobile_report.php', data)
        .subscribe((res: any) => {
          resolve(res)
        }, (error) => {
          reject(error)
        })
    })
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      let data = {
        uname: username,
        upass: password,
      };
      this.http.post('http://202.29.52.232/service/taksmog_login.php', data)
        .subscribe(res => {
          resolve(res)
        }, err => {
          reject(err)
        });
    });
  }
}
