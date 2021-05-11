import { LitElement, css, html } from 'lit';

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
    return { name: { type: String } };
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super();
  }

  // Uncomment this to remove the Shadow DOM from this component.
  createRenderRoot() {
    return this;
  }

  render() {
    return html` <style>
        body {
          background-color: #2f3d4e;
          color: white;
        }

        .panel {
          margin-bottom: 20px;
          background-color: #4e5d6c;
        }

        .panel-heading {
          padding: 10px 15px 10px 15px;
          background-color: #485563;
        }

        .panel-body {
          padding: 15px;
        }
      </style>
      <pq-menu active="paper"></pq-menu>

      <div class="container">
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

        <div class="panel panel-default">
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
        </div>

        <div class="panel panel-default size-section">
          <div class="panel-heading">
            <h2>1: Pick a paper size</h2>
          </div>
          <div class="panel-body">
            <a href="#/paper/{{ paper.id }}" ng-repeat="paper in paperSizes()">
              <div
                class="paperIcon"
                ng-style="paperIconStyle(paper)"
                ng-class="{ 'notSelected' : selectedPaper !== paper }"
              >
                <span class="paperName">{{ paper.name }}</span>
              </div></a
            >
          </div>
        </div>

        <div class="panel panel-default layout-section">
          <div class="panel-heading">
            <h2>
              2: Pick a layout
              <span ng-show="selectedPaper"
                >for {{ selectedPaper.name }} size paper</span
              >
            </h2>
          </div>
          <div class="panel-body">
            <div>
              <a
                href="#/layout/{{ layout.id }}"
                ng-repeat="layout in paperLayouts(selectedPaper)"
              >
                <div class="layoutIcon">
                  <span class="layoutName">{{ layout.name }}</span>
                  <div
                    style="width: 100%; height: 125px; border: 1px solid black; overflow: hidden;"
                  >
                    <img
                      style="position: relative; width: 100%;"
                      ng-src="{{ layout.image }}"
                    />
                  </div>
                </div>
              </a>
            </div>

            <div ng-if="!selectedPaper">
              You must pick a paper size before you pick a layout for your page.
            </div>
          </div>
        </div>

        <div class="panel panel-default">
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
        </div>

        <footer>
          <p>© 2021 John Munsch</p>
        </footer>
      </div>
      <!-- /.container -->`;
  }
}

customElements.define(PaperPage.it, PaperPage);
