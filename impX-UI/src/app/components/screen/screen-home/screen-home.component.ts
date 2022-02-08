import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-screen-home',
  templateUrl: './screen-home.component.html',
  styleUrls: ['./screen-home.component.scss']
})
export class ScreenHomeComponent implements OnInit {
    dataSource = new MatTableDataSource<any>();
    noData = false;
    showSelected = false;
    allRows = [];
    initialStatus = '';
    itemCount: number = 0;
    displayedColumns = ['screenId', 'name', 'publisherName', 'city', 'country', 'venueTypeDisp', 'statusText'];
    actions = [];
    selectedTab = 0;
    @ViewChild(MatPaginator, { static: false })
    paginator!: MatPaginator;
    @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.dataSource.paginator = this.paginator;
    }
    @ViewChild(MatSort, { static: false })
    firstTableSort!: MatSort;
    @ViewChild(MatSort, { static: false }) set matSort1(ms: MatSort) {
        this.firstTableSort = ms;
        this.dataSource.sort = this.firstTableSort;
    }
  constructor(
      private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAllScreens();
  }

  getAllScreens() {
    this.http.get<any>('http://localhost:5000/api/screens/getall', { observe: 'response'}).subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.body);
        this.dataSource.paginator = this.paginator;
        this.itemCount = this.dataSource.data.length;
        // for column-wise sorting added corresponding fields
        this.dataSource.data.forEach(ele => {
            ele.city = ele.geoLocation.city;
            ele.country = ele.geoLocation.country;
            ele.venueTypeDisp = ele.venueType.length !== 0 ? ele.venueType.join(', ') : 'NA';
        });
        // to apply filtering only for the columns that are displayed on the listing home page rather than all the fields in datasource
        this.dataSource.filterPredicate = (data, filter: string) => {
            return (
                data.screenId.toString().trim().toLowerCase().includes(filter) ||
                data.name.toString().trim().toLowerCase().includes(filter) ||
                data.publisherName.toString().trim().toLowerCase().includes(filter) ||
                data.city.toString().trim().toLowerCase().includes(filter) ||
                data.country.toString().trim().toLowerCase().includes(filter) ||
                data.venueTypeDisp.toString().trim().toLowerCase().includes(filter) ||
                data.statusText.toString().trim().toLowerCase().includes(filter)
            );
        };
    }, (err: HttpErrorResponse) => {
        console.log('exception')
    });
  }

}
