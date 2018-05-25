import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, LoadingController } from 'ionic-angular';
import { ReportProvider } from '../../providers/report/report';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  private showToolbar: boolean = false;
  private headerImgSize: string = '100%';
  private headerImgUrl: string = '';
  private transition: boolean = false;
  private articles: Array<any> = new Array(10).fill('');

  private reports: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ref: ChangeDetectorRef,
    private loadingCtrl: LoadingController,
    private reportProvider: ReportProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransparentBarPage');
    this.headerImgUrl = './assets/bg.jpg';
    this.loadReport();
    // this.content.enableScrollListener();
  }

  onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 120;
    if (scrollTop < 0) {
      this.transition = false;
      this.headerImgSize = `${Math.abs(scrollTop) / 2 + 100}%`;
    } else {
      this.transition = true;
      this.headerImgSize = '100%'
    }
    this.ref.detectChanges();
  }

  async loadReport() {
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Loading...',
    });

    loader.present()

    await this.reportProvider.getReportList().then((res: any) => {
      console.log(res)
      this.reports = res;
      loader.dismiss();
    }, error => {
      loader.dismiss();
    })
  }

  viewReportDetail(p: any) {
    console.log('report detail')
  }





}
