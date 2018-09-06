import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
// import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public username: string;
  public password: string;

  private uname: string;
  private utoken: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private userProvider: UserProvider
  ) {
  }

  ionViewDidLoad() {
    this.checkLogin();
  }


  doLogin() {
    let loader = this.loadingCtrl.create({ spinner: 'dots', content: 'Logging...' });
    loader.present();
    this.userProvider.login(this.username, this.password)
      .then((res: any) => {
        loader.dismiss();
        console.log(res);
        const data = res[0];
        if (data.id !== 'error') {
          this.storage.set('utoken', data.id);
          this.storage.set('fname', data.name);
          this.storage.set('uname', this.username);
          this.navCtrl.setRoot(TabsPage);
        } else {
          console.log('no');
        }
      }, (error) => {
        loader.dismiss();
        console.log('Could not login to server!', error);
      });
    // console.log('doLogin LoginPage');
  }

  async checkLogin() {
    await this.storage.get('uname')
      .then((res) => {
        this.uname = res;
      });
    await this.storage.get('utoken')
      .then((res) => {
        this.utoken = res;
      });

    console.log(this.uname, this.utoken)

    if (this.uname && this.utoken) {
      console.log('already login');
      this.navCtrl.setRoot(TabsPage);
    }
  }

  doRegister() {
    this.navCtrl.push(RegisterPage)
  }

}
