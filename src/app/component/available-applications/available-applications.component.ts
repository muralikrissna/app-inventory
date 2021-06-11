import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ApplicationService } from 'src/app/service/application.service';
import { ApplicationDetails } from '../../model/application-details.model';
import { UserService } from '../../service/user.service';
import { Department } from '../../model/department.model';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';

export interface Application {
  id: number;
  department: string;
  lob: string;
  name: string;
  businessTotal: number;
  businessValue: number;
  agility: number;
  techTotal: number;
  applicationCompletedStatus: string;
}

const ELEMENT_DATA: Application[] = [
  {
    id: 1, department: 'system', lob: 'Auto and Fire Insurance',
    name: 'Application-1', businessTotal: 86, businessValue: 20, agility: 45, techTotal: 21, applicationCompletedStatus: '70%'
  },
  {
    id: 2, department: 'Finance', lob: 'Banking',
    name: 'Application-2', businessTotal: 90, businessValue: 22, agility: 46, techTotal: 22, applicationCompletedStatus: '75%'
  },
  {
    id: 3, department: 'system', lob: 'Health',
    name: 'Application-3', businessTotal: 85, businessValue: 11, agility: 43, techTotal: 31, applicationCompletedStatus: '62%'
  },
  {
    id: 4, department: 'system', lob: 'Life',
    name: 'Application-4', businessTotal: 94, businessValue: 20, agility: 44, techTotal: 30, applicationCompletedStatus: '85%'
  },
  {
    id: 5, department: 'Finance', lob: 'Billing and payments',
    name: 'Application-5', businessTotal: 80, businessValue: 15, agility: 45, techTotal: 20, applicationCompletedStatus: '78%'
  },
  {
    id: 6, department: 'system', lob: 'Auto and Fire Insurance',
    name: 'Application-6', businessTotal: 85, businessValue: 13, agility: 42, techTotal: 30, applicationCompletedStatus: '90%'
  },
  {
    id: 7, department: 'Finance', lob: 'Billing and payments',
    name: 'Application-7', businessTotal: 83, businessValue: 15, agility: 45, techTotal: 23, applicationCompletedStatus: '95%'
  },
  {
    id: 8, department: 'system', lob: 'Auto and Fire Insurance',
    name: 'Application-8', businessTotal: 82, businessValue: 20, agility: 42, techTotal: 20, applicationCompletedStatus: '88%'
  },
];

@Component({
  selector: 'app-available-applications',
  templateUrl: './available-applications.component.html',
  styleUrls: ['./available-applications.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AvailableApplicationsComponent implements OnInit, OnDestroy {
  applicationsRetrieved: ApplicationDetails[] = [];
  applicationRetrievedById: ApplicationDetails;
  departmentsRetrieved: Department[] = [];
  applicationDataSource: any;
  newDisplayedColumns: string[] = ['id', 'departmentid', 'lob', 'applicationname', 'Action', 'Score'];
  displayedColumns: string[] = ['id', 'department', 'lob', 'name', 'Action', 'Score'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  _mobileQueryListener: () => void;
  isExpanded: Application | undefined;
  show: boolean = true;
  mobileQuery: MediaQueryList;
  filterValue: string = "";
  searchString: String = "";
  businessValueScore: number[] = [80, 70];
  businessTotalScore: number[] = [275, 250];
  agilityScore: number[] = [200, 150];
  techTotalScore: number[] = [200, 150];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private userService: UserService, private applicationService: ApplicationService, private spinnerService: NgxSpinnerService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.applicationDataSource.filter = this.filterValue;
  }

  retrieveAllApplicationDetails() {
    // this.spinnerService.show();
    this.applicationService.retrieveAllApplicationDetails().subscribe((data: ApplicationDetails[]) => {
      this.applicationsRetrieved = data;
      this.applicationDataSource = new MatTableDataSource(this.applicationsRetrieved);
      this.applicationDataSource.paginator = this.paginator;
    })
    // this.spinnerService.hide();
  }

  ngOnInit(): void {

    this.retrieveAllApplicationDetails();
    this.spinnerService.show();
    this.spinnerService.hide();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.show = false;
  }

  back() {
    this.router.navigate(['/landingPage']);
  }

  hideApplications() {
    this.show = false;
  }

  showApplications() {
    this.show = true;
  }

  editApplication(localApplicationID: string) {
    localStorage.setItem('applicationID', localApplicationID);
    this.router.navigate(['/layout/editApplication']);
  }
}