import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorPackage } from 'src/app/model/vendorPackage.model';
import { VendorPackageService } from 'src/app/service/vendorPackage.service';

@Component({
  selector: 'app-edit-vendorpackage-details',
  templateUrl: './edit-vendorpackage-details.component.html',
  styleUrls: ['./edit-vendorpackage-details.component.css', '../../css/common-styles.css']
})

export class EditVendorpackageDetailsComponent implements OnInit {
  existingApplicationId: number = 0;
  vendorPackageModel = new VendorPackage();
  ValidNumberIndicator = true;
  showSpinner: Boolean;
  showDialogue: Boolean;

  public constructor(private titleService: Title, private _snackBar: MatSnackBar, private router: Router, private dialog: MatDialog, private vendorPackageService: VendorPackageService) {
    this.titleService.setTitle("Inventory - Vender Package Details");
  }

  clickMethod() {

    this.update();
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
    this.showSpinner = false;
    this._snackBar.open("Details are saved successfully", "Dismiss", {
      duration: 2000,
      verticalPosition: "top"
    });
  }

  update() {
    this.showSpinner = true;
    this.vendorPackageModel.applicationId = Number(localStorage.getItem('applicationID'));
    this.vendorPackageService.updateVendorPackageDetails(this.vendorPackageModel).subscribe((data: any) => {
      this.showSpinner = false;
      this.openSnackBar();
    })
  }

  cancel() {
    localStorage.clear();
    this.router.navigate(['/landingPage']);
  }

  ngOnInit(): void {
    this.existingApplicationId = Number(localStorage.getItem('applicationID'));
    if (this.existingApplicationId != 0) {
      this.vendorPackageService.retrieveVendorPackageByApplicationId(this.existingApplicationId).subscribe((data: VendorPackage) => {
        if (data == null) {
          this.vendorPackageModel = new VendorPackage();
        }
        else {
          this.vendorPackageModel = data;
        }
      })
    }
  }
}

