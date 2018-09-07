import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { ReportProvider } from '../../providers/report/report';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  private parking: any = null;
  private userProfile: any;
  private lat: number;
  private lon: number;
  private pos: Array<number>;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private camera: Camera,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private reportProvider: ReportProvider
    // private facebook: FacebookServiceProvider
  ) {
    this.parking = { id: 0, pname: '', available: 1 };
    // this.facebook.getProfile().subscribe((res) => {
    //   this.parking.id_user = res.id;
    // }, (error) => { console.log(error); });
  }

  ionViewDidLoad() {
    this.showLocation();
  }

  showLocation() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    // loading.present();

    let pos = this.reportProvider.getLocation()


    this.parking.lat = pos.lat
    this.parking.lon = pos.lon


    // this.reportProvider.getLocation().then((res) => {
    //   console.log(res)
    //   this.parking.lat = res.lat
    //   this.parking.lon = res.lon
    //   loading.dismiss();
    // })


  }

  save() {
    let toast = this.toastCtrl.create({
      message: 'เพิ่มข้อมูลสำเร็จ',
      duration: 3000,
      position: 'bottom',
    });

    toast.onDidDismiss(() => {
      this.navCtrl.pop();
      console.log('Dismissed toast');
    });

    console.log(this.parking)

    // this.http.post("http://cgi.uru.ac.th/service/udsafe_mobile_report.php", this.parking)
    //   .subscribe(res => {
    //     toast.present();
    //   }, (err) => {
    //     console.log('can not add this data')
    //   })

    this.reportProvider.postMobileReport(this.parking).then((res) => {
      toast.present();
    }, (error) => {
      console.log(error);
    })

    console.log('save ParkingAddPage');
  }


  takePicture() {

    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.parking.photo = base64Image
    }, (error) => {
      console.log('Camera error!', error);
    });
  }

  browsePicture() {
    let options: CameraOptions = {
      destinationType: 0,
      sourceType: 0,
      allowEdit: true
    };

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.parking.photo = base64Image;
    }, (error) => {
      console.log('Browse picture error!', error);
    });

    console.log('browsePicture ParkingAddPage');
  }

  removePicture() {
    this.parking.photo = null;
    console.log('removePicture ParkingAddPage');
  }

}
