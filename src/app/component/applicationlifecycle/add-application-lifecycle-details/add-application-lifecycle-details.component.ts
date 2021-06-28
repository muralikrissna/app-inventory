import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApplicationLifecycle } from 'src/app/model/applicationlifecycle.model';
import { ApplicationLifecycleService } from 'src/app/service/applicationlifecycle.service';

@Component({
  selector: 'app-add-application-lifecycle-details',
  templateUrl: './add-application-lifecycle-details.component.html',
  styleUrls: ['./add-application-lifecycle-details.component.css', '../../../css/common-styles.css']
})

export class AddApplicationLifecycleDetailsComponent implements OnInit {

  applicationlifecycleModel: ApplicationLifecycle[] = [];
  checkId: number;
  i: number;
  LocalStorageValue: Number;
  showSpinner: Boolean;
  showDialogue: Boolean;

  public constructor(private titleService: Title, private dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router, private applicationlifecycleservice: ApplicationLifecycleService) {
    this.titleService.setTitle("Inventory - Application Lifecycle Details");
  }

  ngOnInit(): void {
    for (this.i = 0; this.i < 14; this.i++) {
      this.applicationlifecycleModel[this.i] = { id: 1, applicationId: 1, questionId: this.i + 1, answer: '' };
    }
    this.LocalStorageValue = Number(localStorage.getItem('savedApplicationID'));
  }

  clickMethod() {
    this.save();
    this.showDialogue = false;
  }

  onNoClick(): void {
    this.showDialogue = false;
  }

  check() {
    for (this.checkId = 0; this.checkId <= 13; this.checkId++) {
      if (this.applicationlifecycleModel[this.checkId].answer === '')
        return true;
    }
    return false;
  }

  openDialog() {
    this.showDialogue = true;
  }

  openSnackBar(id: number) {
    this._snackBar.open("Details are saved successfully", "Dismiss", {
      duration: 2000,
      verticalPosition: "top"
    });
  }

  checkAppId() {
    if (this.LocalStorageValue === Number(localStorage.getItem('savedApplicationID'))) {
      return true;
    }
    else {
      return false;
    }
  }

  save() {
    this.showSpinner = true;
    for (this.i = 0; this.i < 14; this.i++) {
      this.applicationlifecycleModel[this.i].applicationId = Number(localStorage.getItem('savedApplicationID'));
    }
    this.applicationlifecycleservice.storeAndupdateApplicationLifecycleDetails(this.applicationlifecycleModel).subscribe((data: any) => {
      this.showSpinner = false;
      this.openSnackBar(data);
    })
  }

  cancel() {

    localStorage.clear();
    this.router.navigate(['/landingPage']);
  }
}

