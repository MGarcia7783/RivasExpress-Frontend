import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
  imports: [IonRouterOutlet],
})
export class ProductosComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
