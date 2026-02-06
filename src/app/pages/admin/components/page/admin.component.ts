import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from "@ionic/angular/standalone";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [IonRouterOutlet],
})
export class AdminComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
