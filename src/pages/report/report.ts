import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';

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
    private geolocation: Geolocation
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
    loading.present();
    new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((res: any) => {
        this.parking.lat = res.coords.latitude;
        this.parking.lon = res.coords.longitude;
        resolve(loading.dismiss());
      }, (error) => {
        reject(error);
      })
    })

    let watch = this.geolocation.watchPosition();
    watch.subscribe((res: any) => {
      this.parking.lat = res.coords.latitude;
      this.parking.lon = res.coords.longitude;
    });
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

    this.http.post("http://cgi.uru.ac.th/service/udsafe_mobile_report.php", this.parking)
      .subscribe(res => {
        toast.present();
      }, (err) => {
        console.log('can not add this data')
      })

    console.log('save ParkingAddPage');
  }


  takePicture() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: this.camera.Direction.FRONT,
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/png;base64,' + imageData;
      this.parking.photo = base64Image;
    }, (error) => {
      console.log('Camera error!', error);
    });

    console.log('takePicture ParkingAddPage');
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
