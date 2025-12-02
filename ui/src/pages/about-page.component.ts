import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { version as uiVersion } from "./version.ts";
import "./shared-components/pq-adblock.ts";
import "./shared-components/pq-footer.ts";

@customElement("about-page")
export class AboutPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<pq-menu active="about"></pq-menu>
      <div class="container">
        <pq-adblock></pq-adblock>

        <h2>About PaperQuik v${uiVersion}</h2>

        <p>
          I apparently started building the first version of PaperQuik some time
          around 2013-14. At that time I encountered a lot(!) of problems (SVG
          wouldn't print properly in any major browser so I had to make a huge
          image to print instead), I was using
          AngularJS/jQuery/Paper.js/Underscore.js/etc.
        </p>
        <p>
          It looked dead for many years, but I kept it running on the server
          because I actually used myself regularly to print out sheets for
          whatever project or idea I happened to be working on at the time.
        </p>
        <p>
          Fast forward to 2021 and the new version of same project uses only
          <a href="https://lit.dev">lit</a> and
          <a href="https://github.com/visionmedia/page.js">page</a> to do all
          the same work. I still use
          <a href="https://getbootstrap.com">Bootstrap</a> because I couldn't
          design my way out of a wet paper bag, but otherwise the code has
          gotten enormously simpler and should form the basis of something I can
          build on much more easily. Also, IE is finally dead so I don't have to
          care about that at all. Yay!
        </p>

        <h2>Credits</h2>

        <p>print by Adrien Coquet from the Noun Project</p>

        <pq-adblock></pq-adblock>

        <pq-footer></pq-footer>
      </div>`;
  }
}
