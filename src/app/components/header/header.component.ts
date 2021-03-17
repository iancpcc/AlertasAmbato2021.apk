import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo?:string
  @Input() smsIcon?:string
  @Input() icono?:string
  @Output() eventClick=new EventEmitter()
  constructor() { }

  ngOnInit() {}

  accion(){
    this.eventClick.emit();
  }
}
