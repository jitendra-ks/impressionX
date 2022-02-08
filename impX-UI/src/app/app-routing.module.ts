import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ScreenForecastComponent } from './components/screen/screen-forecast/screen-forecast.component';
import { ScreenHomeComponent } from './components/screen/screen-home/screen-home.component';

const routes: Routes = [
    { path: '', component: ScreenHomeComponent },
    { path: 'screen-forecast/:screenId', component: ScreenForecastComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
