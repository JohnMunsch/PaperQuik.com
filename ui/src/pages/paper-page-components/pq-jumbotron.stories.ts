import { html } from 'lit';

import './pq-jumbotron.js';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Jumbotron',
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template = (args) => html`<pq-jumbotron></pq-jumbotron>`;

export const Default = Template.bind({});
