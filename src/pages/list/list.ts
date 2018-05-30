import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController } from 'ionic-angular';
import { ReportProvider } from '../../providers/report/report';
import { DetailPage } from '../detail/detail';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
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
    this.loadReport();
    // this.content.enableScrollListener();
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

  viewReportDetail(r: any) {
    this.navCtrl.push(DetailPage, { data: r })
    // console.log(r)
  }


}
