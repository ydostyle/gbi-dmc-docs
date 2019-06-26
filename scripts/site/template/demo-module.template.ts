import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../share/share.module';

{{imports}}

@NgModule({
  imports     : [
    ShareModule,
    RouterModule.forChild([
      { path: '', component: DmcDemo{{component}}Component },
    ])
  ],
  declarations: [
{{declarations}}
  ],
  entryComponents: [
{{entryComponents}}
  ]
})
export class DmcDemo{{component}}Module {

}
