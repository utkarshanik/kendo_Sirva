import { Component, NgModule } from '@angular/core';
import { KENDO_CALENDAR, CalendarModule, KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { HomeComponent } from "../home/home.component";
import { DatamanageComponent } from '../datamanage/datamanage.component';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { ThemeService } from '../services/theme.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    TabStripModule, 
    KENDO_CALENDAR, 
    CalendarModule, 
    KENDO_DATEINPUTS, 
    HomeComponent,
    DatamanageComponent,
    KENDO_BUTTONS,NgIf
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private themeService: ThemeService) {}
  isDarkMode: boolean = true;
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.toggleDarkMode();
  }
}
