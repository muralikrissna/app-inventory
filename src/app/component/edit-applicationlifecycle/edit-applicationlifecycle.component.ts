import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApplicationLifecycleService } from 'src/app/service/applicationlifecycle.service';
import { ApplicationLifecycle } from 'src/app/model/applicationlifecycle.model';


@Component({
  selector: 'app-edit-applicationlifecycle',
  templateUrl: './edit-applicationlifecycle.component.html',
  styleUrls: ['./edit-applicationlifecycle.component.css', '../../css/common-styles.css']
})
export class EditApplicationlifecycleComponent implements OnInit {
  existingApplicationId: number = 0;
  applicationlifecycleRetrieve: ApplicationLifecycle[] = [];
  checkId: number;
  id: number;
  dataId: number;
  i: number;
  showSpinner: Boolean;
  showDialogue: Boolean;


  public constructor(private titleService: Title, private dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router, private applicationlifecycleservice: ApplicationLifecycleService) {
    this.titleService.setTitle("Inventory - Application Lifecycle Details");

  }

  ngOnInit(): void {

    this.existingApplicationId = Number(localStorage.getItem('applicationID'));
    for (this.i = 0; this.i < 14; this.i++) {
      this.applicationlifecycleRetrieve[this.i] = { id: 1, applicationId: this.existingApplicationId, questionId: this.i + 1, answer: '' };
    }
    if (this.existingApplicationId !== 0) {
      this.applicationlifecycleservice.retrieveApplicationLifecycleByApplicationId(this.existingApplicationId).subscribe((data: ApplicationLifecycle[]) => {
        if (data.length == 0) {
          for (this.i = 0; this.i < 14; this.i++) {
            this.applicationlifecycleRetrieve[this.i] = { id: 1, applicationId: this.existingApplicationId, questionId: this.i + 1, answer: '' };
          }
        } else {
          this.applicationlifecycleRetrieve = data;
        }
      })

    }
  }

  clickMethod() {

    this.update();
    this.showDialogue = false;

  }

  onNoClick(): void {
    this.showDialogue = false;
  }

  check() {
    for (this.id = 0; this.id <= 13; this.id++) {
      if (this.applicationlifecycleRetrieve[this.id].answer === '')
        return true;
    }
    return false;
  }

  openDialog() {
    this.showDialogue = true;
  }

  openSnackBar() {
    this.showSpinner = false;
    this._snackBar.open("Details are updated successfully", "Dismiss", {
      duration: 2000,
      verticalPosition: "top"
    });
  }

  update() {

    this.showSpinner = true;
    console.log(this.applicationlifecycleRetrieve);
    this.applicationlifecycleservice.storeAndupdateApplicationLifecycleDetails(this.applicationlifecycleRetrieve).subscribe((data: any) => {
      this.showSpinner = false;
      this.openSnackBar();

    })

  }

  cancel() {

    localStorage.clear();
    this.router.navigate(['/landingPage']);
  }
}








