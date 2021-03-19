import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { PerfilPageModule } from '../perfil/perfil.module';
import { HomePageModule } from '../home/home.module';
import { HistorialPageModule } from '../historial/historial.module';
import { NotificacionPageModule } from '../notificacion/notificacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PerfilPageModule,
    HomePageModule,
    HistorialPageModule,
    NotificacionPageModule,
    IonicModule,
    TabsPageRoutingModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
