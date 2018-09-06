import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, Modal, AlertController, Platform } from 'ionic-angular';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation';
import { ReportProvider } from '../../providers/report/report';
import { LayerPage } from '../layer/layer';
import { AddDataPage } from '../add-data/add-data';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public map: L.map;
  public marker: L.marker;
  public pos: number[];
  private lat: number = 0;
  private lon: number = 0;

  //lyrGroup
  private lyrGroup: any;

  //lyrs
  private prov: any;
  private amp: any;
  private tam: any;
  private vill: any;
  private tk_hp: any;
  private roads: any;
  private satellite: any;
  private hybrid: any;
  private terrain: any;
  private report: any;

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private reportProvider: ReportProvider,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {

  }

  ionViewDidLoad() {
    this.loadMap();
  }

  // ionViewWillEnter() {
  //   this.loadMap();
  // }

  loadMap() {
    this.map = L.map('map', {
      center: [16.611229, 98.768188],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
    })

    // h = roads only; m = standard roadmap; p = terrain; r = somehow altered roadmap; s = satellite only; t = terrain only; y = hybrid;

    this.roads = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.hybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.terrain = L.tileLayer('http://{s}.google.com/vt/lyrs=t&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    // overlay
    this.prov = L.tileLayer.wms("http://map.nu.ac.th/gs-alr2/ows?", {
      layers: 'alr:ln9p_prov',
      format: 'image/png',
      transparent: true,
      CQL_FILTER: 'prov_code=63',
      zIndex: 5
    });

    this.amp = L.tileLayer.wms("http://map.nu.ac.th/gs-alr2/ows?", {
      layers: 'alr:ln9p_amp',
      format: 'image/png',
      transparent: true,
      CQL_FILTER: 'prov_code=63',
      zIndex: 4
    });

    this.tam = L.tileLayer.wms("http://map.nu.ac.th/gs-alr2/ows?", {
      layers: 'alr:ln9p_tam',
      format: 'image/png',
      transparent: true,
      CQL_FILTER: 'prov_code=63',
      zIndex: 3
    });

    this.vill = L.tileLayer.wms("http://map.nu.ac.th/gs-alr2/ows?", {
      layers: 'alr:ln9p_vill',
      format: 'image/png',
      transparent: true,
      CQL_FILTER: 'prov_code=63',
      zIndex: 5
    });

    this.tk_hp = L.tileLayer.wms("http://cgi.uru.ac.th/gs-hotspot/ows?", {
      layers: 'hp:hotspot_ud_today',
      format: 'image/png',
      transparent: true,
      zIndex: 5
    });

    this.report = L.tileLayer.wms("http://cgi.uru.ac.th/gs-hotspot/ows?", {
      layers: 'hp:mobile_report',
      format: 'image/png',
      transparent: true,
      zIndex: 5
    });

    this.lyrGroup = {
      lyr: [
        { name: 'ขอบเขตอำเภอ', lyr: 'ud_amp', wms: this.amp.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'ขอบเขตตำบล', lyr: 'ud_tam', wms: this.tam.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'ขอบเขตจังหวัด', lyr: 'ud_prov', wms: this.prov.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'หมู่บ้าน', lyr: 'ud_vill', wms: this.vill, type: 'overlay', 'isChecked': false },
        { name: 'จุดเกิดไฟ', lyr: 'ud_hp', wms: this.tk_hp.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'รายงานสถานการณ์', lyr: 'ud_report', wms: this.report.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'แผนที่ถนน', lyr: 'roads', wms: this.roads.addTo(this.map), type: 'base', 'isChecked': false },
        { name: 'แผนที่ภาพดาวเทียม', lyr: 'satellite', wms: this.satellite, type: 'base', 'isChecked': false },
        { name: 'แผนที่ผสม', lyr: 'hybrid', wms: this.hybrid, type: 'base', 'isChecked': false },
        { name: 'แผนที่ภูมิประเทศ', lyr: 'terrain', wms: this.terrain, type: 'base', 'isChecked': true },
      ]
    }
    // L.control.layers(baseLayers, overlay, { position: 'topright' }).addTo(this.map);
  }

  showLocation() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then((res) => {
        this.pos = [res.coords.latitude, res.coords.longitude];
        this.lat = res.coords.latitude;
        this.lon = res.coords.longitude;

        this.reportProvider.setLocation(this.lat, this.lon);

        this.map.setView(this.pos, 16);
        this.marker = L.marker(this.pos, { draggable: false }).addTo(this.map);

        loading.dismiss();
        this.marker.on("dragend", function (e) {
          this.pos = [e.target._latlng.lat, e.target._latlng.lng];
        });
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      let watch = this.geolocation.watchPosition();
      watch.subscribe((res) => {
        this.pos = [res.coords.latitude, res.coords.longitude];
        this.lat = res.coords.latitude;
        this.lon = res.coords.longitude;
        this.reportProvider.setLocation(this.lat, this.lon);
      });
    })
  }

  gotoReport() {
    if (this.lat === 0 || this.lon === 0) {
      const alert = this.alertCtrl.create({
        title: 'ระบุตำแหน่งของท่าน',
        subTitle: 'ไม่พบตำแหน่งของท่าน โปรดกลับไประบุตำแหน่งของท่านก่อนรายงานสถานการณ์',
        buttons: ['ตกลง']
      })
      alert.present()

    } else {
      this.navCtrl.push(AddDataPage, {
        pos: this.pos
      })
    }
  }

  selectLayers() {
    const modal: Modal = this.modalCtrl.create(LayerPage, this.lyrGroup);
    modal.present();
    modal.onDidDismiss((res) => {
      this.lyrGroup.lyr = res
      // console.log(res)
      this.lyrFn(res)
    });
  }

  lyrFn(lyrs: any) {
    for (let i of lyrs) {
      if (i.isChecked) {
        this.map.addLayer(i.wms);
      } else {
        this.map.removeLayer(i.wms);
      }
    }
  }

  refreshPage() {
    // location.reload();
    window.location.reload();
    console.log('test')
  }


}
