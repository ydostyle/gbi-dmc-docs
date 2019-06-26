import { Component } from '@angular/core';

@Component({
  selector     : 'dmc-doc-introduce',
  templateUrl  : './introduce.html',
  preserveWhitespaces: false
})
export class DmcDocIntroduceComponent {
  goLink(link: string) {
    if (window) {
      window.location.hash = link;
    }
  }
}
