import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { LoginPage } from '../login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public fname: string;

  constructor(
    public navCtrl: NavController,
    public storage: Storage
  ) { }

  ionViewDidLoad() {
    this.loadUser();
  }

  async loadUser() {
    await this.storage.get('fname')
      .then((res) => {
        this.fname = res;
      })
  }

  logout() {
    this.storage.clear()
      .then((res) => {
        // this.navCtrl.setRoot(LoginPage);
        this.refreshPage()
      })
  }

  refreshPage() {
    // location.reload();
    window.location.reload();
    console.log('test')
  }


}
