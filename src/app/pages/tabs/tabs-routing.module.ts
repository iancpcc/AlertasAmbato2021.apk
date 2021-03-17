import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from '../home/home.page';
import { PerfilPage } from '../perfil/perfil.page';
import { HistorialPage } from '../historial/historial.page';
import { NotificacionPage } from '../notificacion/notificacion.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch:'full'
   },
    {
    path: '',
    component: TabsPage,
    children:[
      {path: 'home',
      component:HomePage
       },

       {path: 'perfil',
      component: PerfilPage
      },
       {path: 'history',
      component: HistorialPage
      },
      
      {path: 'noty',
      component: NotificacionPage
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
