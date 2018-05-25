import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ReportProvider {
  private url: string = 'http://cgi.uru.ac.th/service';

  constructor(
    public http: HttpClient

  ) {
  }

  getReportList() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/udsafe_show_report.php').subscribe((res: any) => {
        resolve(res)
      }, (error) => {
        reject(error)
      })
    })
  }



}
