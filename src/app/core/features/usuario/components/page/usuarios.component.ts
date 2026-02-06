import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from "@ionic/angular/standalone";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  imports: [IonRouterOutlet],
})
export class UsuariosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
