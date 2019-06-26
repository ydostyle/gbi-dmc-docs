import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../share/share.module';

import { DmcDemoAvatarBadgeComponent } from './badge';
import { DmcDemoAvatarBasicComponent } from './basic';
import { DmcDemoAvatarDynamicComponent } from './dynamic';
import { DmcDemoAvatarTypeComponent } from './type';
import { DmcDemoAvatarComponent } from './demoTemplate.component';


@NgModule({
  imports     : [
    ShareModule,
    RouterModule.forChild([
      { path: '', component: DmcDemoAvatarComponent },
    ])
  ],
  declarations: [
		DmcDemoAvatarBadgeComponent,
		DmcDemoAvatarBasicComponent,
		DmcDemoAvatarDynamicComponent,
		DmcDemoAvatarTypeComponent,
		DmcDemoAvatarComponent,

  ],
  entryComponents: [

  ]
})
export class DmcDemoAvatarModule {

}
