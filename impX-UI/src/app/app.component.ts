import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'improveathon';
    mainForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) {
        
    }

    ngOnInit(): void {

        this.mainForm = this.formBuilder.group({
            first: new FormControl('')
        })

    }

    submit() {

    }
}
