import { expect, fixture, html } from '@open-wc/testing';

import './pq-jumbotron.js';

describe('pq-jumbotron', () => {
  it('displays if show is true', async () => {
    const el = await fixture(html`<pq-jumbotron .show="true"></pq-jumbotron>`);
    expect(el).dom.to.equal(
      `<pq-jumbotron .show="true">
         <div class="jumbotron panel">
           <h1>
             The Paper You Need - Available Right Away
           </h1>
           <p>
           </p>
           <p>
             <button class="btn btn-lg btn-primary">
               Get Started
             </button>
           </p>
         </div>
       </pq-jumbotron>`
    );
  });

  it(`doesn't if show is false`, async () => {
    const el = await fixture(html`<pq-jumbotron .show="false"></pq-jumbotron>`);

    expect(el).dom.to.equal(
      `<pq-jumbotron .show="false">
         <div class="jumbotron panel">
           <h1>
             The Paper You Need - Available Right Away
           </h1>
           <p>
           </p>
           <p>
             <button class="btn btn-lg btn-primary">
               Get Started
             </button>
           </p>
         </div>
       </pq-jumbotron>`
    );
  });
});
