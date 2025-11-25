import { LitElement, html } from 'lit';

export class PaperQuikAdblock extends LitElement {
  static get it() {
    return 'pq-adblock';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return {};
  }

  constructor() {
    super();
  }

  // Remove the Shadow DOM from this component.
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

customElements.define(PaperQuikAdblock.it, PaperQuikAdblock);
