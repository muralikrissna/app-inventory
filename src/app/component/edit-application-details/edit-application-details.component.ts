import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../service/user.service';
import { Department } from '../../model/department.model';
import { ApplicationDetails } from '../../model/application-details.model';
import { ApplicationService } from 'src/app/service/application.service';

@Component({
  selector: 'app-edit-application-details',
  templateUrl: './edit-application-details.component.html',
  styleUrls: ['./edit-application-details.component.css', '../../css/common-styles.css']
})
export class EditApplicationDetailsComponent implements OnInit {
  i: number;
  existingApplicationId: number = 0;
  departmentRetrieved = new Department();
  departmentsRetrieved: Department[] = [];
  public applicationModel = new ApplicationDetails();
  applicationsRetrieved: ApplicationDetails[] = [];
  selectedDepartment = new Department();
  selectedDepartmentID: number = 0;
  selectedLob: string = '';
  selectedFunctionality: string = '';
  functionalities: string[] = [];
  lineOfBusiness: string[] = ['Auto and Fire Insurance', 'Banking'];
  public addAppFormGroup: FormGroup;
  showSpinner: Boolean;
  showDialogue: Boolean;

  public constructor(private _snackBar: MatSnackBar, private router: Router, private dialog: MatDialog,
    private userService: UserService, private applicationService: ApplicationService, private changeDetectorRefs: ChangeDetectorRef) {
    this.addAppFormGroup = new FormGroup({});
  }

  ngOnInit(): void {
    this.showSpinner = true;
    this.addAppFormGroup = new FormGroup({
      AppName: new FormControl('', [Validators.required]),
      AppDesc: new FormControl('', [Validators.required]),
      AppDept: new FormControl('', [Validators.required]),
      AppLob: new FormControl('', [Validators.required]),
      AppFun: new FormControl('', [Validators.required])
    });

    this.retrieveAllDepartmentDetails();
    this.existingApplicationId = Number(localStorage.getItem('applicationID'));

    if (this.existingApplicationId != 0) {
      this.applicationService.retrieveApplicationById(this.existingApplicationId).subscribe((data: ApplicationDetails) => {
        this.applicationModel = data;
        this.showSpinner = false;
        this.retrieveDepartmentById(this.applicationModel.departmentId);
        this.addAppFormGroup.setValue({
          AppName: this.applicationModel.applicationName,
          AppDesc: this.applicationModel.applicationDescription,
          AppDept: this.applicationModel.departmentName,
          AppLob: this.applicationModel.lineOfBusiness,
          AppFun: this.applicationModel.functionality
        });
        this.selectedDepartmentID = this.applicationModel.departmentId;
        this.selectedLob = this.applicationModel.lineOfBusiness;
        if (this.selectedLob === "Auto and Fire Insurance") {
          this.functionalities = ['Marketing', 'Sales and Distribution', 'Product management', 'Underwritting', 'Policy Acquisition & Servicing', 'Claims Management', 'Finance and Accounts', 'Reinsurance'];
        }
        if (this.selectedLob === "Banking") {
          this.functionalities = ['Accounts', 'Loan', 'Mortgages', 'Payments', 'Fraud', 'Risk & Compliance', 'OutSourcing', 'Wealth & Retirement'];
        }
        this.selectedFunctionality = this.applicationModel.functionality;

      })
    }
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

  retrieveDepartmentById(id: number) {

    this.userService.retrieveDepartmentById(id).subscribe((data: Department) => {
      this.departmentRetrieved = data;

    })

  }

  retrieveAllDepartmentDetails() {

    this.userService.retrieveAllDepartmentDetails().subscribe((data: Department[]) => {
      this.departmentsRetrieved = data;

    })
  }

  clickMethod() {

    this.update();
    this.showDialogue = false;

  }

  onNoClick(): void {
    this.showDialogue = false;
  }

  check() {

    if (this.applicationModel.nameOfTheComponentManager === '' || this.applicationModel.smeProvidedByManagers === '' ||
      this.applicationModel.nameOfPrimaryTechSME === '' || this.applicationModel.nameOfPrimaryBA === '')
      return true;
    else
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
    this.applicationModel.departmentId = this.selectedDepartmentID;
    this.applicationModel.lineOfBusiness = this.selectedLob;
    this.applicationModel.functionality = this.selectedFunctionality;
    this.applicationModel.businessValue = 0;
    this.applicationModel.agility = 0;
    this.applicationModel.businessTotal = 0;
    this.applicationModel.techTotal = 0;
    this.applicationService.updateApplicationDetails(this.applicationModel).subscribe((data: any) => {
      this.showSpinner = false;
      this.openSnackBar();
    })

  }

  cancel() {
    localStorage.clear();
    this.router.navigate(['/landingPage']);
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.addAppFormGroup.controls[controlName].hasError(errorName);
  }
}



