import { LitElement, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import { paper, paperLayouts, paperSizes } from './paper-generation.js';

import './pq-menu.js';

export class PaperPage extends LitElement {
  // Note: Your element must have a hyphen in the name (for example, "hello-world"). It's a requirement
  // so that our components don't collide with future additions to HTML.
  static get it() {
    return 'paper-page';
  }

  static get properties() {
    // All of the properties of this component and a type for each (used when converting
    // attributes to property values).
    return { size: { type: String }, layout: { type: String } };
  }

  constructor() {
    super();

    this.paperSize = null;
  }

  // Uncomment this to remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  adBlock() {
    return html`<div class="panel panel-default">
      <div class="panel-body">
        <div class="leaderboardAd">
          <script
            async
            src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
          <!-- PaperQuik Leaderboard -->
          <ins
            class="adsbygoogle"
            style="display:inline-block;width:728px;height:90px"
            data-ad-client="ca-pub-8376642740439271"
            data-ad-slot="6535942993"
          ></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      </div>
    </div>`;
  }

  paperIconStyle(paperSize) {
    return {
      width: `${paperSize.width / 2.8}px`,
      height: `${paperSize.height / 2.8}px`,
    };
  }

  stepOne() {
    return html`<div class="panel panel-default size-section">
      <div class="panel-heading">
        <h2>1: Pick a paper size</h2>
      </div>
      <div class="panel-body">
        ${paperSizes.map((paperSize) => {
          return html`<a href="/paper/${paperSize.id}">
            <div
              class="paperIcon ${paperSize.id === this.size
                ? 'selected'
                : 'notSelected'}"
              style="${styleMap(this.paperIconStyle(paperSize))}"
            >
              <span class="paperName">${paperSize.name}</span>
            </div>
          </a>`;
        })}
      </div>
    </div>`;
  }

  stepTwo() {
    return html` <div class="panel panel-default layout-section">
      <div class="panel-heading">
        <h2>
          2: Pick a layout
          ${this.paperSize ? `for ${this.paperSize.name} size paper` : ''}
        </h2>
      </div>
      <div class="panel-body">
        ${this.size
          ? html` <div>
              ${paperLayouts.map((paperLayout) => {
                return html`<a href="/${this.size}/${paperLayout.id}">
                  <div class="layoutIcon">
                    <span class="layoutName">${paperLayout.name}</span>
                    <div
                      style="width: 100%; height: 125px; border: 1px solid black; overflow: hidden;"
                    >
                      <img
                        style="position: relative; width: 100%;"
                        src="/img/${paperLayout.id}-paper.jpg"
                      />
                    </div>
                  </div>
                </a>`;
              })}
            </div>`
          : html`<div>
              You must pick a paper size before you pick a layout for your page.
            </div>`}
      </div>
    </div>`;
  }

  stepThree() {
    return html`<div class="panel panel-default print-section">
      <div class="panel-heading">
        <h2>3: Print your paper</h2>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-md-8 preview">${paper(false, paperSizes[0])}</div>
          <div class="col-md-4">
            <button class="btn btn-primary btn-block" ng-click="print()">
              Print your paper
            </button>

            <div id="mc_embed_signup">
              <form
                action="http://johnmunsch.us8.list-manage.com/subscribe/post?u=bd3c8c7355797b6633a3503e7&amp;id=e3f181919d"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                class="validate"
                target="_blank"
                novalidate
              >
                <label for="mce-EMAIL"
                  >Subscribe to learn when PaperQuik updates</label
                >
                <input
                  type="email"
                  value=""
                  name="EMAIL"
                  class="email"
                  id="mce-EMAIL"
                  placeholder="email address"
                  required
                />
                <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                <div style="position: absolute; left: -5000px;">
                  <input
                    type="text"
                    name="b_bd3c8c7355797b6633a3503e7_e3f181919d"
                    value=""
                  />
                </div>
                <div class="clear">
                  <button
                    type="submit"
                    name="subscribe"
                    id="mc-embedded-subscribe"
                    class="btn btn-primary"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div> `;
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('size')) {
      this.paperSize = paperSizes.find(
        (paperSize) => paperSize.id === this.size
      );
    }
  }

  render() {
    return html`${paper(true, paperSizes[0])}
      <pq-menu class="d-print-none" active="paper"></pq-menu>
      <div class="container d-print-none">
        <div class="jumbotron" ng-show="$storage.showWelcome">
          <h1>The Paper You Need - Available Right Away</h1>
          <p></p>
          <p>
            <button
              class="btn btn-primary btn-lg"
              ng-click="$storage.showWelcome = false"
            >
              Get Started
            </button>
          </p>
        </div>

        ${this.adBlock()} ${this.stepOne()} ${this.stepTwo()}
        ${this.stepThree()} ${this.adBlock()}

        <footer>
          <p>© 2021 John Munsch</p>
        </footer>
      </div>`;
  }
}

customElements.define(PaperPage.it, PaperPage);
