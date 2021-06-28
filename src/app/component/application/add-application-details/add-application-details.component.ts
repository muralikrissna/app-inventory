import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../service/user.service';
import { Department } from '../../../model/department.model';
import { ApplicationDetails } from '../../../model/application-details.model';
import { ApplicationService } from 'src/app/service/application.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-application-details',
  templateUrl: './add-application-details.component.html',
  styleUrls: ['./add-application-details.component.css', '../../../css/common-styles.css']
})

export class AddApplicationDetailsComponent implements OnInit {
  departmentsRetrieved: Department[] = [];
  public applicationModel = new ApplicationDetails();
  selectedDepartment = new Department();
  selectedDepartmentID: number = 0;
  selectedLob: string = '';
  selectedFunctionality: string = '';
  functionalities: string[] = [];
  lineOfBusiness: string[] = ['Auto and Fire Insurance', 'Banking'];
  public addAppFormGroup: FormGroup;
  initialId: number = 0;
  passedId: number = 0;
  showSpinner: Boolean;
  showDialogue: Boolean;
  public constructor(private _snackBar: MatSnackBar, private router: Router, private dialog: MatDialog,
    private userService: UserService, private applicationService: ApplicationService, private changeDetectorRefs: ChangeDetectorRef) {
    this.addAppFormGroup = new FormGroup({});
    localStorage.setItem('savedApplicationID', 0 + '');
    this.initialId = Number(localStorage.getItem('savedApplicationID'));
  }

  ngOnInit(): void {
    this.addAppFormGroup = new FormGroup({
      AppName: new FormControl('', [Validators.required]),
      AppDesc: new FormControl('', [Validators.required]),
      AppDept: new FormControl('', [Validators.required]),
      AppLob: new FormControl('', [Validators.required]),
      AppFun: new FormControl('', [Validators.required])
    });
    this.retrieveAllDepartmentDetails();
    this.selectedDepartmentID = this.applicationModel.departmentId;
    this.selectedLob = this.applicationModel.lineOfBusiness;
    if (this.selectedLob === "Auto and Fire Insurance") {
      this.functionalities = ['Marketing', 'Sales and Distribution', 'Product management', 'Underwritting', 'Policy Acquisition & Servicing', 'Claims Management', 'Finance and Accounts', 'Reinsurance'];
    }
    if (this.selectedLob === "Banking") {
      this.functionalities = ['Accounts', 'Loan', 'Mortgages', 'Payments', 'Fraud', 'Risk & Compliance', 'OutSourcing', 'Wealth & Retirement'];
    }
    this.selectedFunctionality = this.applicationModel.functionality;
  }

  onSelectDept(event: any) {
  }

  onSelectLob(event: any) {
    if (event.value === "Auto and Fire Insurance") {
      this.functionalities = ['Marketing', 'Sales and Distribution', 'Product management', 'Underwritting', 'Policy Acquisition & Servicing', 'Claims Management', 'Finance and Accounts', 'Reinsurance']
    }
    if (event.value === "Banking") {
      this.functionalities = ['Accounts', 'Loan', 'Mortgages', 'Payments', 'Fraud', 'Risk & Compliance', 'OutSourcing', 'Wealth & Retirement'];
    }
  }

  retrieveAllDepartmentDetails() {
    this.userService.retrieveAllDepartmentDetails().subscribe((data: Department[]) => {
      this.departmentsRetrieved = data;
    })
  }

  clickMethod() {

    this.save();
    this.showDialogue = false;

  }

  onNoClick(): void {
    this.showDialogue = false;
  }
  check() {
    this.applicationModel.applicationName = this.addAppFormGroup.get('AppName')!.value;
    this.applicationModel.applicationDescription = this.addAppFormGroup.get('AppDesc')!.value;
    this.selectedDepartment = this.addAppFormGroup.get('AppDept')!.value;
    this.applicationModel.departmentId = this.selectedDepartment.departmentId;
    this.applicationModel.lineOfBusiness = this.addAppFormGroup.get('AppLob')!.value.viewValue;
    this.applicationModel.functionality = this.addAppFormGroup.get('AppFun')!.value;

    if (this.applicationModel.nameOfTheComponentManager === '' || this.applicationModel.smeProvidedByManagers === '' ||
      this.applicationModel.nameOfPrimaryTechSME === '' || this.applicationModel.nameOfPrimaryBA === '')
      return true;
    else
      return false;
  }

  openDialog() {
    this.showDialogue = true;

  }

  openSnackBar(id: number) {
    this.showSpinner = false;
    this._snackBar.open("Details are saved successfully. \nYour saved ID is " + id + '.', "Dismiss", {
      duration: 5000,
      verticalPosition: "top"
    });
  }

  openUpdateSnackBar() {
    this.showSpinner = false;
    this._snackBar.open("Details are updated successfully", "Dismiss", {
      duration: 2000,
      verticalPosition: "top"
    });
  }

  save() {
    this.showSpinner = true;

    this.applicationModel.departmentId = this.selectedDepartmentID;
    this.applicationModel.lineOfBusiness = this.selectedLob;
    this.applicationModel.functionality = this.selectedFunctionality;
    this.applicationModel.businessValue = 0;
    this.applicationModel.agility = 0;
    this.applicationModel.businessTotal = 0;
    this.applicationModel.techTotal = 0;
    if (this.initialId == Number(localStorage.getItem('savedApplicationID'))) {
      this.applicationService.storeApplicationDetails(this.applicationModel).subscribe((data: any) => {
        localStorage.setItem('savedApplicationID', data + '');
        this.showSpinner = false;
        this.openSnackBar(data);
      })
    }
    else {
      this.applicationModel.applicationId = Number(localStorage.getItem('savedApplicationID'));
      this.applicationService.updateApplicationDetails(this.applicationModel).subscribe((data: any) => {
      })
      this.showSpinner = false;
      this.openUpdateSnackBar();
    }
  }

  cancel() {
    localStorage.clear();
    this.router.navigate(['/landingPage']);
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.addAppFormGroup.controls[controlName].hasError(errorName);
  }
}

