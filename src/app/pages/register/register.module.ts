import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { RegisterPage } from './register.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule

  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
