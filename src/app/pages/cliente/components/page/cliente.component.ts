import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { IonRouterOutlet } from "@ionic/angular/standalone";

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  imports: [IonRouterOutlet],
})
export class ClienteComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
