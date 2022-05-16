import { html } from 'lit';

import './pq-footer.js';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Footer',
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template = (args) => html`<pq-footer></pq-footer>`;

export const Default = Template.bind({});
