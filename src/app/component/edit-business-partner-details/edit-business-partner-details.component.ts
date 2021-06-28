import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BusinessPartnerService } from 'src/app/service/businesspartner.service';
import { BusinessPartner } from 'src/app/model/businesspartner.model';

@Component({
  selector: 'app-edit-business-partner-details',
  templateUrl: './edit-business-partner-details.component.html',
  styleUrls: ['./edit-business-partner-details.component.css', '../../css/common-styles.css']
})
export class EditBusinessPartnerDetailsComponent implements OnInit {
  existingApplicationId: number = 0;
  public addBusFormGroup: FormGroup;
  businesspartnerModel = new BusinessPartner();
  businesspartnersRetrieved: BusinessPartner[] = [];
  showSpinner: Boolean;
  showDialogue: Boolean;


  public constructor(private titleService: Title, private _snackBar: MatSnackBar, private dialog: MatDialog, private router: Router, private businessPartnerService: BusinessPartnerService,
    private changeDetectorRefs: ChangeDetectorRef) {
    this.titleService.setTitle("Inventory - Business Partner Details");
    this.addBusFormGroup = new FormGroup({});
  }

  ngOnInit(): void {
    this.addBusFormGroup = new FormGroup({
      BusPart: new FormControl('', [Validators.required])
    });

    this.existingApplicationId = Number(localStorage.getItem('applicationID'));
    if (this.existingApplicationId != 0) {
      this.businessPartnerService.retrieveBusinessPartnerByApplicationId(this.existingApplicationId).subscribe((data: BusinessPartner) => {
        if (data == null) {
          this.businesspartnerModel = new BusinessPartner();
        }
        else {
          this.businesspartnerModel = data;
          this.addBusFormGroup.setValue({
            BusPart: this.businesspartnerModel.primaryBusinessPartner
          })

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
    if (this.businesspartnerModel.secondaryBusinessPartner === '' || this.businesspartnerModel.businessPartnerManagers === '' ||
      this.businesspartnerModel.businessPartnerDirectors === '')
      return true;
    else
      return false;
  }

  openDialog() {
    this.showDialogue = true;
  }

  update() {
    this.showSpinner = true;
    this.businesspartnerModel.applicationId = Number(localStorage.getItem('applicationID'));
    this.businessPartnerService.updateBusinessPartnerDetails(this.businesspartnerModel).subscribe((data: any) => {
      this.showSpinner = false;
      this.openSnackBar();
    })

  }

  cancel() {
    localStorage.clear();
    this.router.navigate(['/landingPage']);
  }

  openSnackBar() {
    this.showSpinner = false;
    this._snackBar.open("Details are updated successfully", "Dismiss", {
      duration: 2000,
      verticalPosition: "top"
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.addBusFormGroup.controls[controlName].hasError(errorName);
  }
}



