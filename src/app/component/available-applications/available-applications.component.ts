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

export interface Application {
  id: number;
  department: string;
  lob: string;
  name: string;
  businessTotal: number;
  businessValue: number;
  agility: number;
  techTotal: number;
}


@Component({
  selector: 'app-available-applications',
  templateUrl: './available-applications.component.html',
  styleUrls: ['./available-applications.component.css', '../../css/common-styles.css'],
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
  showSpinner: boolean = false;
  newDisplayedColumns: string[] = ['id', 'departmentid', 'lob', 'applicationname', 'Action', 'Score'];
  displayedColumns: string[] = ['id', 'department', 'lob', 'name', 'Action', 'Score'];
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

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private userService: UserService, private applicationService: ApplicationService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim();
    this.filterValue = this.filterValue.toLowerCase();
    this.applicationDataSource.filter = this.filterValue;
  }

  retrieveAllApplicationDetails() {
    this.showSpinner = true;
    this.applicationService.retrieveAllApplicationDetails().subscribe((data: ApplicationDetails[]) => {
      this.showSpinner = false;
      this.applicationsRetrieved = data;
      this.applicationDataSource = new MatTableDataSource(this.applicationsRetrieved);
      this.applicationDataSource.paginator = this.paginator;
    })
  }

  ngOnInit(): void {

    this.retrieveAllApplicationDetails();

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