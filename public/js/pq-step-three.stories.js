import { html } from 'lit';

import './pq-step-three.js';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Step Three',
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template = (args) => html`<pq-step-three></pq-step-three>`;

export const Default = Template.bind({});
