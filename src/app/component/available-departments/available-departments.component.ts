import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Department } from '../../model/department.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { AvailableDepartmentsDialogBoxComponent } from './available-departments-dialog-box/available-departments-dialog-box.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-available-departments',
  templateUrl: './available-departments.component.html',
  styleUrls: ['./available-departments.component.css',  '../../css/common-styles.css']
})

export class AvailableDepartmentsComponent implements OnInit {
  departmentModel = new Department();
  departmentsRetrieved: Department[] = [];
  dataSourceD: any;
  showSpinner: boolean = false;
  displayedColumns: string[] = ['departmentId', 'departmentName', 'departmentOwner', 'action'];
  private updateSubscription: Subscription;


  constructor(public dialog: MatDialog, private userService: UserService, public changeDetectorRefs: ChangeDetectorRef, private router: Router) { }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator

  ngOnInit(): void {
    this.retrieveAllDepartmentDetails();

  }

  retrieveAllDepartmentDetails() {
    this.showSpinner = true;
    this.userService.retrieveAllDepartmentDetails().subscribe((data: Department[]) => {
      this.showSpinner = false;
      this.departmentsRetrieved = data;
      this.dataSourceD = new MatTableDataSource(this.departmentsRetrieved);
      this.dataSourceD.paginator = this.paginator;

    })
  }

  openServerDialog(element: any) {
    this.departmentModel = _.cloneDeep(element);
    this.dialog.open(AvailableDepartmentsDialogBoxComponent, {
      width: '250px',
      data: { model: this.departmentModel }
    })
      .afterClosed()
      .subscribe(
        () => { this.retrieveAllDepartmentDetails() });
    this.router.navigate(['/layout/newdepartment']);
  }
}



