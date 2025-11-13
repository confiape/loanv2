import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import {withThemeByClassName, withThemeByDataAttribute} from '@storybook/addon-themes';
setCompodocJson(docJson);

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      parentSelector: 'html',
      defaultTheme: 'light',
      themes: {
        light: 'light',
        dark: 'dark',
        brand: 'brand',
      },
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
