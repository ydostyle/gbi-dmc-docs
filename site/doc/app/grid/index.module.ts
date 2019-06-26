import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../share/share.module';

import { DmcDemoGridBasicComponent } from './basic';
import { DmcDemoGridFlexComponent } from './flex';
import { DmcDemoGridComponent } from './demoTemplate.component';


@NgModule({
  imports     : [
    ShareModule,
    RouterModule.forChild([
      { path: '', component: DmcDemoGridComponent },
    ])
  ],
  declarations: [
		DmcDemoGridBasicComponent,
		DmcDemoGridFlexComponent,
		DmcDemoGridComponent,

  ],
  entryComponents: [

  ]
})
export class DmcDemoGridModule {

}
