import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Modal } from 'ionic-angular';
import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';
import { Geolocation } from '@ionic-native/geolocation';
import { ReportPage } from '../report/report';
import { LayerPage } from '../layer/layer';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  public map: L.map;
  public marker: L.marker;
  public pos: number[];

  //lyrGroup
  private lyrGroup: any;
  private lyrBase: any;

  //lyrs
  private ud_prov: any;
  private ud_amp: any;
  private ud_tam: any;
  private radar_phs: any;
  private radar_cri: any;
  private radar_kkn: any;
  private ud_vill: any;
  private longlin_parcel_centroid: any;
  private ud_rain: any;
  private ud_hp: any;
  private roads: any;
  private satellite: any;
  private hybrid: any;
  private terrain: any;

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map', {
      center: [18.00, 100.50],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
    })

    this.roads = L.gridLayer.googleMutant({
      type: 'roadmap', // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
      zIndex: 0
    });

    this.satellite = L.gridLayer.googleMutant({
      type: 'satellite', // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
      zIndex: 0
    });

    this.hybrid = L.gridLayer.googleMutant({
      type: 'hybrid', // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
      zIndex: 0
    });

    this.terrain = L.gridLayer.googleMutant({
      type: 'terrain', // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
      zIndex: 0
    });

    // overlay
    const imageUrl = 'http://rain.tvis.in.th/output/';

    this.radar_cri = L.imageOverlay(imageUrl + 'CRI.png', [[22.305437, 102.143387], [17.596297, 97.611690]]);
    this.radar_kkn = L.imageOverlay(imageUrl + 'KKN.png', [[18.793550, 105.026265], [14.116192, 100.541459]]);
    this.radar_phs = L.imageOverlay(imageUrl + 'PHS.png', [[19.094393, 102.475537], [14.411350, 97.983591]]);

    this.ud_prov = L.tileLayer.wms("http://map.nu.ac.th/gs-alr2/ows?", {
      layers: 'alr:ln9p_prov',
      format: 'image/png',
      transparent: true,
      CQL_FILTER: 'prov_code=53',
      zIndex: 5
    });

    this.ud_amp = L.tileLayer.wms("http://map.nu.ac.th/gs-alr2/ows?", {
      layers: 'alr:ln9p_amp',
      format: 'image/png',
      transparent: true,
      CQL_FILTER: 'prov_code=53',
      zIndex: 4
    });

    this.ud_tam = L.tileLayer.wms("http://map.nu.ac.th/gs-alr2/ows?", {
      layers: 'alr:ln9p_tam',
      format: 'image/png',
      transparent: true,
      CQL_FILTER: 'prov_code=53',
      zIndex: 3
    });

    this.ud_vill = L.tileLayer.wms("http://map.nu.ac.th/gs-alr2/ows?", {
      layers: 'alr:ln9p_vill',
      format: 'image/png',
      transparent: true,
      CQL_FILTER: 'prov_code=53',
      zIndex: 5
    });

    // const ud_disaster_commun = L.tileLayer.wms("http://cgi.uru.ac.th/gs-rain/ows?", {
    //   layers: 'rain:disaster_community_4326',
    //   format: 'image/png',
    //   transparent: true
    // });

    this.longlin_parcel_centroid = L.tileLayer.wms("http://cgi.uru.ac.th/gs-durian/ows?", {
      layers: 'longlin:longlin_parcel_centroid',
      format: 'image/png',
      transparent: true,
      styles: 'tree_green',
      zIndex: 5
    });

    this.ud_rain = L.tileLayer.wms("http://cgi.uru.ac.th/gs-rain/ows?", {
      layers: 'rain:rain_now_report_ud_tb',
      format: 'image/png',
      transparent: true,
      zIndex: 5
    });

    this.ud_hp = L.tileLayer.wms("http://cgi.uru.ac.th/gs-hotspot/ows?", {
      layers: 'hp:hotspot_ud_today',
      format: 'image/png',
      transparent: true,
      zIndex: 5
    });


    // const baseLayers = {
    //   "แผนที่ถนน": roads,
    //   "แผนที่ภาพดาวเทียม": satellite,
    //   "แผนที่ผสม": hybrid,
    //   "แผนที่ภูมิประเทศ": terrain.addTo(this.map),
    // };

    // const overlay = {
    //   "ขอบเขตจังหวัด": this.ud_prov.addTo(this.map),
    //   "ขอบเขตอำเภอ": this.ud_amp.addTo(this.map),
    //   "ขอบเขตตำบล": this.ud_tam,
    //   "ข้อมูลฝนจาก Radar: พิษณุโลก": this.radar_phs.addTo(this.map),
    //   "ข้อมูลฝนจาก Radar: เชียงราย": this.radar_cri,
    //   "ข้อมูลฝนจาก Radar: ขอนแก่น": this.radar_kkn,
    //   "หมู่บ้าน": this.ud_vill,
    //   "แปลงปลูกทุเรียน": this.longlin_parcel_centroid,
    //   "สถานีที่มีปริมาณน้ำฝน": this.ud_rain.addTo(this.map),
    //   "ตำแหน่ง hotspot": this.ud_hp.addTo(this.map)
    // };

    this.lyrGroup = {
      lyr: [
        { name: 'ขอบเขตอำเภอ', lyr: 'ud_amp', wms: this.ud_amp.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'ขอบเขตตำบล', lyr: 'ud_tam', wms: this.ud_tam.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'ขอบเขตจังหวัด', lyr: 'ud_prov', wms: this.ud_prov.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'ข้อมูลฝนจาก Radar: พิษณุโลก', lyr: 'radar_phs', wms: this.radar_phs, type: 'overlay', 'isChecked': false },
        { name: 'ข้อมูลฝนจาก Radar: เชียงราย', lyr: 'radar_cri', wms: this.radar_cri, type: 'overlay', 'isChecked': false },
        { name: 'ข้อมูลฝนจาก Radar: ขอนแก่น', lyr: 'radar_kkn', wms: this.radar_kkn, type: 'overlay', 'isChecked': false },
        { name: 'หมู่บ้าน', lyr: 'ud_vill', wms: this.ud_vill, type: 'overlay', 'isChecked': false },
        { name: 'แปลงปลูกทุเรียน', lyr: 'longlin_parcel_centroid', wms: this.longlin_parcel_centroid, type: 'overlay', 'isChecked': false },
        { name: 'สถานีที่มีฝนตก', lyr: 'ud_rain', wms: this.ud_rain.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'จุดเกิดไฟ', lyr: 'ud_hp', wms: this.ud_hp.addTo(this.map), type: 'overlay', 'isChecked': true },
        { name: 'แผนที่ถนน', lyr: 'roads', wms: this.roads, type: 'base', 'isChecked': false },
        { name: 'แผนที่ภาพดาวเทียม', lyr: 'satellite', wms: this.satellite, type: 'base', 'isChecked': false },
        { name: 'แผนที่ผสม', lyr: 'hybrid', wms: this.hybrid, type: 'base', 'isChecked': false },
        { name: 'แผนที่ภูมิประเทศ', lyr: 'terrain', wms: this.terrain.addTo(this.map), type: 'base', 'isChecked': true },
      ]
    }

    // L.control.layers(baseLayers, overlay, { position: 'topright' }).addTo(this.map);

  }

  showLocation() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.geolocation.getCurrentPosition().then((res) => {
      this.pos = [res.coords.latitude, res.coords.longitude];
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
    });
  }

  gotoReport() {
    this.navCtrl.push(ReportPage, {
      pos: this.pos
    })
  }

  selectLayers() {
    const modal: Modal = this.modalCtrl.create(LayerPage, this.lyrGroup);
    modal.present();
    modal.onDidDismiss((res) => {
      this.lyrGroup.lyr = res
      console.log(res)
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



}
