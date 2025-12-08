import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pq-adblock')
export class PaperQuikAdblock extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<div class="panel panel-default">
      <div class="panel-body">
        <div class="leaderboardAd">
          <ins
            class="adsbygoogle"
            style="display:inline-block;width:728px;height:90px"
            data-ad-client="ca-pub-8376642740439271"
            data-ad-slot="6535942993"
          ></ins>
        </div>
      </div>
    </div>`;
  }

  firstUpdated() {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }
}
