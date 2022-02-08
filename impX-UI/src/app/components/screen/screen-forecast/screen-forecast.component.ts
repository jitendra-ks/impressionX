import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, ColumnSeries, DateTimeCategory } from '@syncfusion/ej2-angular-charts';

Chart.Inject(ColumnSeries, DateTimeCategory);

@Component({
    selector: 'app-screen-forecast',
    templateUrl: './screen-forecast.component.html',
    styleUrls: ['./screen-forecast.component.scss']
})


export class ScreenForecastComponent implements OnInit {
    screenId: string = '';
    dataSource: any = [];
    xAxis: any = [];
    yAxis: any = [];

    // Line chart
    public chartData: Object[] = [];
    public primaryXAxis: Object = {};
    public primaryYAxis: Object = {};

    title: string = '';

    constructor(
        private activatedRoute: ActivatedRoute,
        private http: HttpClient
    ) { }



    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.screenId = params['screenId'];
            this.http.get<any>('http://localhost:5000/api/screens/get/' + this.screenId, { observe: 'response'}).subscribe((res) => {
                // here you have to bind the array which we will get it from api
                this.dataSource = res.body['impHeatMapData'];
                this.xAxis = {
                    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
                };
                this.yAxis = {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                }
                /// Line graph
                this.primaryXAxis = {
                    interval: 1,
                    title: 'Date',
                    intervalType: 'Days',
                    valueType: 'DateTimeCategory'
                };
                this.primaryYAxis =
                {
                    title: 'Impression Multiplier'
                };
                this.chartData = res.body['impPredData']
                this.chartData.map((item: any) => item['x'] = new Date(item['x']));
                this.title = 'Impression multiplier prediction';
            });
        });
    }
}

