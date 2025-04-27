import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GridModule } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,GridModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sirva_ui';
}
