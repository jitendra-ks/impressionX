import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-screen-forecast',
    templateUrl: './screen-forecast.component.html',
    styleUrls: ['./screen-forecast.component.scss']
})
export class ScreenForecastComponent implements OnInit {
    screenId: string = '';
    constructor(
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.screenId = params['screenId'];
        });
    }

}
