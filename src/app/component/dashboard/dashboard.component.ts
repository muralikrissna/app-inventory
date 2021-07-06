import { Component, OnInit } from '@angular/core';
import { ApplicationDetails } from 'src/app/model/application-details.model';
import { Score } from 'src/app/model/Score.model';
import { ApplicationService } from 'src/app/service/application.service';
@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
   i: number;
   scoreData: Score[] = [];

   data = {
      chart: {
         theme: "fusion",
         caption: "Business Application DashBoard",
         xaxisminvalue: "0",
         xaxismaxvalue: "1000",
         yaxisminvalue: "0",
         yaxismaxvalue: "600",
         xaxisname: "Business Total",
         yaxisname: "Business Value",
         plottooltext: "Application ID : $name,Business Total: $xvalue,Business Value: $yvalue,Agility: $zvalue",
         drawquadrant: "1",
         quadrantxval: "500",
         quadrantyval: "300",
         quadrantlinealpha: "50",
         quadrantlinethickness: "2"
      },
      // categories: [
      //    {
      //       category: [
      //          {
      //             label: "0",
      //             x: "0"
      //          },
      //          {
      //             label: "200",
      //             x: "200",
      //             showverticalline: "1"
      //          },
      //          {
      //             label: "400",
      //             x: "400",
      //             showverticalline: "1"
      //          },
      //          {
      //             label: "600",
      //             x: "600",
      //             showverticalline: "1"
      //          },
      //          {
      //             label: "800",
      //             x: "800",
      //             showverticalline: "1"
      //          },
      //          {
      //             label: "1000",
      //             x: "1000",
      //             showverticalline: "1"
      //          }
      //       ]
      //    }
      // ],
      dataset: [
         {
            data: [{
               x: "0",
               y: "0",
               z: "0",
               name: "0"
            }]

         }
      ]
   };
   constructor(private applicationService: ApplicationService) {

   }

   ngOnInit(): void {

      this.applicationService.retrieveAllApplicationDetails().subscribe((data: ApplicationDetails[]) => {
         // console.log(data);
         for (this.i = 0; this.i < data.length; this.i++) {
            // this.scoreData[this.i] = { name: data[this.i].applicationId.toString(10), x: data[this.i].businessTotal.toString(10), y: data[this.i].businessValue.toString(10), z: data[this.i].agility.toString(10) };
            this.scoreData[this.i] = { name: data[this.i].applicationId.toString(10), x: data[this.i].businessTotal.toString(10), y: data[this.i].businessValue.toString(10), z: data[this.i].agility.toString(10) };
         }
      })

      this.data.dataset = [
         {
            data: [] = this.scoreData
         }
      ]
   }


   width = "100%";
   height = "400";
   type = "bubble";
   dataFormat = "json";
   dataSource = this.data;
}
