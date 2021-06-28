import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Regulatory } from '../model/regulatory.model';
import { RegulatoryService } from '../service/regulatory.service';

@Component({
  selector: 'app-regulatory',
  templateUrl: './regulatory.component.html',
  styleUrls: ['./regulatory.component.css', '../css/common-styles.css']
})

export class RegulatoryComponent implements OnInit {
  i: number = 0;
  regulatoryModel: Regulatory[] = [];
  LocalStorageValue: Number;
  showSpinner: Boolean;
  showDialogue: Boolean;
  public constructor(private titleService: Title, private _snackBar: MatSnackBar, private router: Router, private dialog: MatDialog, private regulatoryService: RegulatoryService) {
    this.titleService.setTitle("Inventory - Regulatory Details");

  }

  clickMethod() {
    this.showDialogue = false;
    this.save();

  }

  onNoClick(): void {
    this.showDialogue = false;
  }

  check() {

    for (this.i = 0; this.i < this.regulatoryModel.length; this.i++) {
      if (this.regulatoryModel[this.i].regulatoryValue) {
        return false;
      }
    }
    return true;
  }

  openDialog() {
    this.showDialogue = true;
  }

  openSnackBar() {
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
    for (this.i = 0; this.i < this.regulatoryModel.length; this.i++) {
      this.regulatoryModel[this.i].applicationId = Number(localStorage.getItem('savedApplicationID'));
    }

    this.regulatoryService.storeRegulatoryDetails(this.regulatoryModel).subscribe((data: any) => {
      this.showSpinner = false;
      this.openSnackBar();
    })

  }

  cancel() {
    this.router.navigate(['/landingPage']);
  }

  ngOnInit(): void {
    this.LocalStorageValue = Number(localStorage.getItem('savedApplicationID'));
    for (this.i = 0; this.i < 10; this.i++) {
      this.regulatoryModel[this.i] = { regulatoryId: 0, applicationId: 0, regulatoryValue: false }
    }

  }
}

