import { LitElement, html } from 'lit';

export class PaperQuikAdblock extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
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
          <!-- PaperQuik Leaderboard -->
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
}

customElements.define(PaperQuikAdblock.it, PaperQuikAdblock);
