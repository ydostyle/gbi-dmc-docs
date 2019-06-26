import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../share/share.module';

import { DmcDocChangelogComponent } from './changelog';
import { DmcDocFaqComponent } from './faq';
import { DmcDocIntroduceComponent } from './introduce';


@NgModule({
  imports     : [
    ShareModule,
    RouterModule.forChild([
			{ path: 'changelog', component: DmcDocChangelogComponent },
			{ path: 'faq', component: DmcDocFaqComponent },
			{ path: 'introduce', component: DmcDocIntroduceComponent },

    ])
  ],
  declarations: [
		DmcDocChangelogComponent,
		DmcDocFaqComponent,
		DmcDocIntroduceComponent,

  ]
})
export class DmcDocsModule {

}
