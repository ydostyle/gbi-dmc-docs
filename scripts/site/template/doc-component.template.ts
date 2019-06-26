import { Component } from '@angular/core';

@Component({
  selector     : 'dmc-doc-{{component}}',
  templateUrl  : './{{component}}.html',
  preserveWhitespaces: false
})
export class DmcDoc{{componentName}}Component {
  goLink(link: string) {
    if (window) {
      window.location.hash = link;
    }
  }
}
