import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from "@ionic/angular/standalone";

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  imports: [IonRouterOutlet],
})
export class CategoriasComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
