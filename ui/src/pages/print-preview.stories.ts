import { html } from 'lit';

import './print-preview.component.ts';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Print Preview',
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template = (args) => html`<print-preview></print-preview>`;

export const Default = Template.bind({});
