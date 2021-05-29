import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { Department } from '../../../model/department.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-available-departments-dialog-box',
  templateUrl: './available-departments-dialog-box.component.html',
  styleUrls: ['./available-departments-dialog-box.component.css']
})

export class AvailableDepartmentsDialogBoxComponent implements OnInit {
  departmentModelDialog = new Department();
  public editDepFormGroup: FormGroup;

  constructor(private _snackBar: MatSnackBar, private userService: UserService,
    public dialogRef: MatDialogRef<AvailableDepartmentsDialogBoxComponent>,
    public changeDetectorRefs: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.editDepFormGroup = new FormGroup({});
    this.departmentModelDialog = data.model;
  }

  ngOnInit(): void {
    this.editDepFormGroup = new FormGroup({
      DpName: new FormControl('', [Validators.required]),
      DpOwner: new FormControl('', [Validators.required])
    });
  }

  updateDepartmentDetails() {
    this.userService.updateDepartmentDetails(this.departmentModelDialog).subscribe((data: any) => {
      console.log(data);
      if (data > 0) {
        this.dialogRef.close();
        this.openSnackBar();
      }
    });
  }

  openSnackBar() {
    this._snackBar.open("Details are updated successfully", "Dismiss", {
      duration: 2000,
      verticalPosition: "top"
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.editDepFormGroup.controls[controlName].hasError(errorName);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
