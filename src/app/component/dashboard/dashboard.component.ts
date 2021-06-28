import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
  
  Highcharts: typeof Highcharts = Highcharts;
   chartOptions : Highcharts.Options = { 
      series : [{
         type: 'scatter',
         data: [ 1, 1.5, 2.8, 3.5, 3.9, 4.2 ]
      }]
   };
}