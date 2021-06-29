import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { ServiceManagement } from 'src/app/model/servicemanagement.model';
import { ServiceManagementService } from 'src/app/service/servicemanagement.service';

@Component({
  selector: 'app-servicemanagement',
  templateUrl: './servicemanagement.component.html',
  styleUrls: ['./servicemanagement.component.css', '../../css/common-styles.css']
})

export class ServicemanagementComponent implements OnInit {
  myForm: FormGroup;
  ValidNumberIndicator = true;
  serviceManagementModel: ServiceManagement[] = [];
  checkId: number;
  i: number;
  LocalStorageValue: Number;
  showSpinner: Boolean;
  showDialogue: Boolean;
  constructor(private fb: FormBuilder, private router: Router, private _snackBar: MatSnackBar, private dialog: MatDialog, private serviceManagementService: ServiceManagementService,
    private changeDetectorRefs: ChangeDetectorRef) {
    this.myForm = this.fb.group({
      f: new FormControl("", [Validators.pattern(/\d/)]),
      f1: new FormControl("", [Validators.pattern(/\d/)]),
      f2: new FormControl("", [Validators.pattern(/\d/)]),
      f3: new FormControl("", [Validators.pattern(/\d/)]),
      f4: new FormControl("", [Validators.pattern(/\d/)]),
      f5: new FormControl("", [Validators.pattern(/\d/)]),
      f6: new FormControl("", [Validators.pattern(/\d/)]),
      f7: new FormControl("", [Validators.pattern(/\d/)]),
      f8: new FormControl("", [Validators.pattern(/\d/)]),
      f9: new FormControl("", [Validators.pattern(/\d/)]),
      f10: new FormControl("", [Validators.pattern(/\d/)]),
      f11: new FormControl("", [Validators.pattern(/\d/)]),
      f12: new FormControl("", [Validators.pattern(/\d/)]),
      f13: new FormControl("", [Validators.pattern(/\d/)]),
      f14: new FormControl("", [Validators.pattern(/\d/)]),
      f15: new FormControl("", [Validators.pattern(/\d/)]),
      f16: new FormControl("", [Validators.pattern(/\d/)]),
      f17: new FormControl("", [Validators.pattern(/\d/)]),
      f18: new FormControl("", [Validators.pattern(/\d/)]),
      f19: new FormControl("", [Validators.pattern(/\d/)]),
      f20: new FormControl("", [Validators.pattern(/\d/)]),
      f21: new FormControl("", [Validators.pattern(/\d/)]),
      f22: new FormControl("", [Validators.pattern(/\d/)]),
      f23: new FormControl("", [Validators.pattern(/\d/)]),
      f24: new FormControl("", [Validators.pattern(/\d/)]),
      f25: new FormControl("", [Validators.pattern(/\d/)]),
      f26: new FormControl("", [Validators.pattern(/\d/)])
    });

  }


  clickMethod() {
    this.save();
    this.showDialogue = false;

  }

  onNoClick(): void {
    this.showDialogue = false;

  }
  check() {
    for (this.checkId = 0; this.checkId <= 46; this.checkId++) {
      if (this.serviceManagementModel[this.checkId].answer === '')
        return true;
    }
    return false;
  }

  openDialog() {
    this.showDialogue = true;;

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
    for (this.i = 0; this.i < 47; this.i++) {
      this.serviceManagementModel[this.i].applicationId = Number(localStorage.getItem('savedApplicationID'));
    }
    this.serviceManagementService.storeAndupdateServiceManagementDetails(this.serviceManagementModel).subscribe((data: any) => {
      this.showSpinner = false;
      this.openSnackBar(data);
    })

  }

  cancel() {
    localStorage.clear();
    this.router.navigate(['/landingPage']);
  }

  ngOnInit(): void {
    for (this.i = 0; this.i < 47; this.i++) {
      this.serviceManagementModel[this.i] = { serviceManagementId: 1, applicationId: 1, questionId: this.i + 1, answer: '' };
    }
    this.LocalStorageValue = Number(localStorage.getItem('savedApplicationID'));
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
}

