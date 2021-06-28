import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BusinessPartnerService } from 'src/app/service/businesspartner.service';
import { BusinessPartner } from 'src/app/model/businesspartner.model';

@Component({
  selector: 'app-businesspartner',
  templateUrl: './businesspartner.component.html',
  styleUrls: ['./businesspartner.component.css', '../../css/common-styles.css']
})

export class BusinesspartnerComponent implements OnInit {
  public addBusFormGroup: FormGroup;
  businesspartnerModel = new BusinessPartner();
  businesspartnersRetrieved: BusinessPartner[] = [];
  LocalStorageValue: Number;
  showSpinner: Boolean;
  showDialogue: Boolean;

  public constructor(private titleService: Title, private _snackBar: MatSnackBar, private dialog: MatDialog, private router: Router, private businessPartnerService: BusinessPartnerService,
    private changeDetectorRefs: ChangeDetectorRef) {
    this.titleService.setTitle("Inventory - Business Partner Details");
    this.addBusFormGroup = new FormGroup({});
  }

  clickMethod() {
    this.save();
    this.showDialogue = false;
  }

  onNoClick(): void {
    this.showDialogue = false;
  }

  check() {
    if (this.businesspartnerModel.secondaryBusinessPartner === '' || this.businesspartnerModel.businessPartnerManagers === '' ||
      this.businesspartnerModel.businessPartnerDirectors === '')
      return true;
    else
      return false;
  }

  ngOnInit() {
    this.LocalStorageValue = Number(localStorage.getItem('savedApplicationID'));
    this.addBusFormGroup = new FormGroup({
      BusPart: new FormControl('', [Validators.required])
    });
  }

  openDialog() {
    this.showDialogue = true;
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
    this.businesspartnerModel.applicationId = Number(localStorage.getItem('savedApplicationID'));
    this.businessPartnerService.storeBusinessPartnerDetails(this.businesspartnerModel).subscribe((data: any) => {
      this.showSpinner = false;
      this.openSnackBar(data);
    })

  }

  cancel() {
    localStorage.clear();
    this.router.navigate(['/landingPage']);
  }

  openSnackBar(id: number) {
    this._snackBar.open("Details are saved successfully", "Dismiss", {
      duration: 2000,
      verticalPosition: "top"
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.addBusFormGroup.controls[controlName].hasError(errorName);
  }
}



