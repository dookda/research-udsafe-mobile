import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, LoadingController, ModalController, ToastController, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { ReportProvider } from '../../providers/report/report';
import { HomePage } from '../home/home';
// import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-add-data',
  templateUrl: 'add-data.html',
})
export class AddDataPage {
  public pos: any;
  public lat: number;
  public lon: number;
  public usrData: any;
  public yymmdd: any;
  public ddmmyy: any;

  public reportForm: FormGroup;
  public fplace: FormControl;
  public fdesc: FormControl;
  public ftype: FormControl;
  public imageData: any;
  public imageFile: any;

  public stockKey: string;

  constructor(
    //private transfer: FileTransfer,
    public fb: FormBuilder,
    private camera: Camera,
    public navParams: NavParams,
    private navCtrl: NavController,
    // private loadingCtrl: LoadingController,
    // private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public view: ViewController,
    public http: HttpClient,
    // private geolocation: Geolocation,
    private storage: Storage,
    public reportProvider: ReportProvider,
    private toastCtrl: ToastController
  ) {
    //this.pos = navParams.get('pos');
    this.fplace = fb.control('', Validators.required);
    this.ftype = fb.control('', Validators.required);
    this.fdesc = fb.control('');
    // this.usrData = this.service.getUserData();
    //this.fname = fb.control('', Validators.required);
    this.reportForm = fb.group({
      'pname': this.fplace,
      'ptype': this.ftype,
      'pdesc': this.fdesc,
      //'fname': this.fname
    });
    this.pos = this.reportProvider.getLocation()
    this.lat = this.pos.lat
    this.lon = this.pos.lon
    console.log(this.pos)
  }

  ionViewDidLoad() {
    // this.findLocation();
    this.getStorage();
    let today = new Date();
    this.yymmdd = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    this.ddmmyy = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    //console.log(Date.now());
  }

  getStorage() {
    this.storage.length().then(res => {
      this.stockKey = "data" + (res + 1);
      //console.log(this.stockKey);
    });
  }

  takePicture() {
    const camOpt: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(camOpt).then((imageData) => {
      // this.imageData = imageData;
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageFile = base64Image;
    }, (err) => {
      console.log(err);
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
      this.imageFile = base64Image;
    }, (error) => {
      console.log('Browse picture error!', error);
    });

    console.log('browsePicture ParkingAddPage');
  }

  storeData() {
    let data = {
      'key': this.stockKey,
      'lat': this.lat,
      'lon': this.lon,
      'pname': this.reportForm.controls['pname'].value,
      'pdesc': this.reportForm.controls['pdesc'].value,
      'ptype': this.reportForm.controls['ptype'].value,
      'photo': this.imageFile,
      'yymmdd': this.yymmdd,
      'ddmmyy': this.ddmmyy,
      'imgfile': this.imageFile,
      // 'fname': this.usrData.name_user,
      // 'user_id': this.usrData.id_user
    };

    this.storage.set(this.stockKey, data).then(
      (res) => {
        //console.log('Stored item!');      
        this.resetForm();
        this.getStorage();
      },
      (error) => {
        console.error('Error storing item', error)
      }
    );
  }

  sendData() {

    let toast = this.toastCtrl.create({
      message: 'เพิ่มข้อมูลสำเร็จ',
      duration: 3000,
      position: 'bottom',
    });

    toast.onDidDismiss(() => {
      this.navCtrl.pop();
      // this.navCtrl.setRoot(this.navCtrl.getActive().component);
      // this.navCtrl.setRoot(HomePage)
      console.log('Dismissed toast');
    });

    // let loader = this.loadingCtrl.create({ content: "กำลังบันทึกข้อมูล.." });

    let data = JSON.stringify({
      'lat': this.lat,
      'lon': this.lon,
      'pname': this.reportForm.controls['pname'].value,
      'pdesc': this.reportForm.controls['pdesc'].value,
      'ptype': this.reportForm.controls['ptype'].value,
      'photo': this.imageFile,
      'yymmdd': this.yymmdd,
      'img': this.imageFile
    });

    this.reportProvider.postMobileReport(data).then((res) => {
      toast.present();
      console.log(data);
    }, (error) => {
      console.log(error);
    })
  }

  removePicture() {
    this.imageFile = null;
    console.log('removePicture ParkingAddPage');
  }

  resetForm() {
    this.reportForm.reset();
    this.imageFile = '';
    //this.view.dismiss();
    //this.navCtrl.setRoot(MapPage, this.dat)
  }

}
