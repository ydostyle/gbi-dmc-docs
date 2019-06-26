import { Component } from '@angular/core';

@Component({
  selector     : 'dmc-doc-changelog',
  templateUrl  : './changelog.html',
  preserveWhitespaces: false
})
export class DmcDocChangelogComponent {
  goLink(link: string) {
    if (window) {
      window.location.hash = link;
    }
  }
}
