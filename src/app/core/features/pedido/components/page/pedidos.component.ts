import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
  imports: [IonRouterOutlet],
})
export class PedidosComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
