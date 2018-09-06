import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as L from 'leaflet';
// import 'leaflet.gridlayer.googlemutant';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  public dat: any;
  public map: L.map;
  public marker: L.marker;
  public pos: number[];

  //lyrGroup
  public lyrGroup: any;

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
    public navParams: NavParams
  ) {
    this.dat = this.navParams.get('data')
    // console.log(this.dat)
  }

  ionViewWillEnter() {
    console.log(this.dat);
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map2', {
      center: [18.00, 100.50],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
    })

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

    this.pos = [this.dat.lat, this.dat.lon];
    this.map.setView(this.pos, 16);
    this.marker = L.marker(this.pos, { draggable: false }).addTo(this.map);

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
        { name: 'แผนที่ผสม', lyr: 'hybrid', wms: this.hybrid.addTo(this.map), type: 'base', 'isChecked': false },
        { name: 'แผนที่ภูมิประเทศ', lyr: 'terrain', wms: this.terrain, type: 'base', 'isChecked': true },
      ]
    }

    // L.control.layers(baseLayers, overlay, { position: 'topright' }).addTo(this.map);

  }

}
