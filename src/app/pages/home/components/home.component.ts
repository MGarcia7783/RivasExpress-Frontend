import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { IonRouterOutlet } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonRouterOutlet],
})
export class HomeComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
