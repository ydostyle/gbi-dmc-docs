import { Component } from '@angular/core';

@Component({
  selector     : 'dmc-doc-faq',
  templateUrl  : './faq.html',
  preserveWhitespaces: false
})
export class DmcDocFaqComponent {
  goLink(link: string) {
    if (window) {
      window.location.hash = link;
    }
  }
}
