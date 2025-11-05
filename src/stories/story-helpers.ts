/**
 * Helper utilities for Storybook stories
 * Creates consistent Light vs Dark mode comparisons
 */

/**
 * Creates a side-by-side comparison template for Light and Dark modes
 * @param componentTag - The component HTML tag (e.g., 'app-dropdown', 'app-button')
 * @param bindings - String of Angular bindings to pass to the component
 * @returns Template string with Light/Dark comparison
 */
export const createLightDarkComparison = (componentTag: string, bindings = ''): string => `
  <div style="display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh;">
    <!-- Light Mode -->
    <div style="background-color: #f9fafb; position: relative; border-right: 2px solid #000; padding: 2rem;">
      <div style="position: absolute; top: 1rem; left: 50%; transform: translateX(-50%); z-index: 100; background: white; padding: 0.5rem 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-weight: bold;">
        Light Mode
      </div>
      <${componentTag}
        ${bindings}
      />
    </div>

    <!-- Dark Mode -->
    <div class="dark" style="background-color: #1f2937; position: relative; padding: 2rem;">
      <div style="position: absolute; top: 1rem; left: 50%; transform: translateX(-50%); z-index: 100; background: #374151; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-weight: bold;">
        Dark Mode
      </div>
      <${componentTag}
        ${bindings}
      />
    </div>
  </div>
`;

/**
 * Creates a template for comparing all variants in a 3x2 grid (Light + Dark)
 * @param componentTag - The component HTML tag
 * @param variants - Array of variant names
 * @param baseBindings - Common bindings for all variants
 * @returns Template string with grid comparison
 */
export const createVariantComparison = (
  componentTag: string,
  variants: string[],
  baseBindings = '',
): string => `
  <div style="min-height: 100vh;">
    <!-- Light Mode Variants -->
    <div style="background-color: #f9fafb; padding: 2rem 0 1rem 0;">
      <h2 style="text-align: center; margin-bottom: 1.5rem; font-size: 1.25rem; font-weight: bold; color: #111827;">
        Light Mode - All Variants
      </h2>
      <div style="display: grid; grid-template-columns: repeat(${variants.length}, 1fr); gap: 2rem; justify-content: center; max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
        ${variants
          .map(
            (variant) => `
        <div style="position: relative;">
          <div style="position: absolute; top: -1.5rem; left: 50%; transform: translateX(-50%); background: white; padding: 0.25rem 0.75rem; border-radius: 0.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-size: 0.75rem; font-weight: 600; white-space: nowrap;">
            ${variant}
          </div>
          <${componentTag}
            [variant]="'${variant.toLowerCase()}'"
            ${baseBindings}
          />
        </div>
        `,
          )
          .join('')}
      </div>
    </div>

    <!-- Dark Mode Variants -->
    <div class="dark" style="background-color: #1f2937; padding: 2rem 0 1rem 0;">
      <h2 style="text-align: center; margin-bottom: 1.5rem; font-size: 1.25rem; font-weight: bold; color: white;">
        Dark Mode - All Variants
      </h2>
      <div style="display: grid; grid-template-columns: repeat(${variants.length}, 1fr); gap: 2rem; justify-content: center; max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
        ${variants
          .map(
            (variant) => `
        <div style="position: relative;">
          <div style="position: absolute; top: -1.5rem; left: 50%; transform: translateX(-50%); background: #374151; color: white; padding: 0.25rem 0.75rem; border-radius: 0.25rem; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 0.75rem; font-weight: 600; white-space: nowrap;">
            ${variant}
          </div>
          <${componentTag}
            [variant]="'${variant.toLowerCase()}'"
            ${baseBindings}
          />
        </div>
        `,
          )
          .join('')}
      </div>
    </div>
  </div>
`;

/**
 * Helper to generate common Angular bindings string
 * @param props - Object with property names and values
 * @returns String of Angular bindings
 */
export const generateBindings = (props: Record<string, unknown>): string => {
  return Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `[${key}]="${key}"`;
      }
      return `[${key}]="${key}"`;
    })
    .join('\n        ');
};

/**
 * Wraps any template in a Light/Dark comparison layout
 * Used for complex components with custom templates (like modals)
 * @param template - The complete template to wrap
 * @returns Template string with Light/Dark comparison
 */
export const wrapInLightDarkComparison = (template: string): string => `
  <div style="display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh;">
    <!-- Light Mode -->
    <div style="background-color: #f9fafb; position: relative; border-right: 2px solid #000; padding: 2rem;">
      <div style="position: absolute; top: 1rem; left: 50%; transform: translateX(-50%); z-index: 100; background: white; padding: 0.5rem 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-weight: bold;">
        Light Mode
      </div>
      ${template}
    </div>

    <!-- Dark Mode -->
    <div class="dark" style="background-color: #1f2937; position: relative; padding: 2rem;">
      <div style="position: absolute; top: 1rem; left: 50%; transform: translateX(-50%); z-index: 100; background: #374151; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-weight: bold;">
        Dark Mode
      </div>
      ${template}
    </div>
  </div>
`;

/**
 * Creates a standard render function for stories with Light/Dark comparison
 * @param componentTag - The component HTML tag
 * @param bindings - String of Angular bindings
 * @returns Render function for Storybook stories
 */
export const createLightDarkRender = (componentTag: string, bindings: string) => {
  return (args: Record<string, unknown>) => ({
    props: args,
    template: createLightDarkComparison(componentTag, bindings),
  });
};
