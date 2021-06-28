import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorPackage } from 'src/app/model/vendorPackage.model';
import { VendorPackageService } from 'src/app/service/vendorPackage.service';

@Component({
  selector: 'app-vendorpackage',
  templateUrl: './vendorpackage.component.html',
  styleUrls: ['./vendorpackage.component.css', '../../css/common-styles.css']
})

export class VendorpackageComponent implements OnInit {
  vendorPackageModel = new VendorPackage();
  ValidNumberIndicator = true;
  LocalStorageValue: Number;
  showSpinner: Boolean;
  showDialogue: Boolean;
  public constructor(private titleService: Title, private _snackBar: MatSnackBar, private router: Router, private dialog: MatDialog, private vendorPackageService: VendorPackageService) {
    this.titleService.setTitle("Inventory - Vender Package Details");
  }

  clickMethod() {
    this.save();
    this.showDialogue = false;
  }

  onNoClick(): void {
    this.showDialogue = false;
  }

  check() {
    if (this.vendorPackageModel.engAssociatedManagedServices === "" || this.vendorPackageModel.packageType === null ||
      this.vendorPackageModel.name === "" || this.vendorPackageModel.engAssociatedWithVendorPackage === "" ||
      this.vendorPackageModel.degreeOfCustomization === "" || this.vendorPackageModel.hostedLocation === "" ||
      this.vendorPackageModel.hostedName === "" || this.vendorPackageModel.engAssociatedWithEsternallyHostedVendor === '' ||
      this.vendorPackageModel.isLatestSwVersion === null || this.vendorPackageModel.packageVersion === "" ||
      this.vendorPackageModel.frequencyOfUpdates === "" || this.vendorPackageModel.frequencyOfPatches === "")
      return true;
    else
      return false;
  }

  onlyNumbers(event: { which: any; keyCode: any; }) {
    const ch = (event.which) ? event.which : event.keyCode;
    if (ch > 31 && (ch < 48 || ch > 57)) {
      this.ValidNumberIndicator = false;

      return this.ValidNumberIndicator;
    }
    this.ValidNumberIndicator = true;
    return this.ValidNumberIndicator;
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
    this.vendorPackageModel.applicationId = Number(localStorage.getItem('savedApplicationID'));
    this.vendorPackageService.storeVendorPackageDetails(this.vendorPackageModel).subscribe((data: any) => {
      this.showSpinner = false;
      this.openSnackBar();
    })
  }

  cancel() {
    localStorage.clear();
    this.router.navigate(['/landingPage']);
  }

  ngOnInit(): void {
    this.LocalStorageValue = Number(localStorage.getItem('savedApplicationID'));
  }
}

