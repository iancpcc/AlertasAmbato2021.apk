import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { HistorialPage } from './historial.page';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowserModule,
    ComponentsModule
  ],
  declarations: [HistorialPage]
})
export class HistorialPageModule {}
