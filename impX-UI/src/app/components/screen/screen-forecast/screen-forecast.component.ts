import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, ColumnSeries, DateTimeCategory } from '@syncfusion/ej2-angular-charts';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
// tslint:disable-next-line:no-duplicate-imports
const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

Chart.Inject(ColumnSeries, DateTimeCategory);

@Component({
    selector: 'app-screen-forecast',
    templateUrl: './screen-forecast.component.html',
    styleUrls: ['./screen-forecast.component.scss'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
    
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
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

    date = new FormControl(moment());

    chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
    }

    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normalizedMonth.month());
        this.date.setValue(ctrlValue);
        console.log(ctrlValue['_d']);
        datepicker.close();
        this.loadData(ctrlValue['_d']);
    }


    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.screenId = params['screenId'];
            this.loadData(new Date())
        });
    }

    loadData(val: Date) {
        this.http.get<any>('http://localhost:5000/api/screens/get/' + this.screenId, { observe: 'response'}).subscribe((res) => {
                // here you have to bind the array which we will get it from api
                this.dataSource = res.body['impHeatMapData'];
                this.xAxis = {
                    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
                    title: 'Hour'
                };
                this.yAxis = {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                }
                /// Line graph
                this.primaryXAxis = {
                    valueType: 'DateTimeCategory',
                    interval: 1,
                    title: 'Date',
                    intervalType: 'Days',
                    labelFormat: 'dd'
                };        
                this.primaryYAxis =
                {
                    title: 'Impression Multiplier'
                };
                this.chartData = res.body['impPredData'].filter((item: any) => {
                    if ((new Date(item['x'])).getMonth() == val.getMonth() && (new Date(item['x'])).getFullYear() == val.getFullYear()) {
                        return item;
                    }
                });
                this.title = 'Impression multiplier prediction';
            });
    }
}

