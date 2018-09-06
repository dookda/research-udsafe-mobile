import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public fname: string;
  public lname: string;
  public username: string;
  public password: string;
  public email: string;
  public mobile: string;

  public formGroup: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private userProvider: UserProvider,
    public formBuilder: FormBuilder,
  ) {
    this.formGroup = this.formBuilder.group({
      fname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
      mobile: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
  }

  doRegister() {
    let loader = this.loadingCtrl.create({ spinner: 'dots', content: 'Logging...' });
    loader.present();
    this.userProvider.register(this.fname, this.username, this.password, this.email, this.mobile)
      .then((res) => {
        loader.dismiss();
        if (res[0].status == 'ok') {
          this.navCtrl.setRoot(LoginPage);
        } else {
          console.log('no');
        }
      }, (error) => {
        loader.dismiss();
        console.log('Could not login to server!', error);
      });
  }

}
