## Directory Structure

### `src/`
Main source folder containing all application code.

### `src/components/`
Reusable, self-contained components that can be used across multiple pages.
- Examples: Navigation, Header, Footer, Button, Card, Modal
- Each component should be independent and not tied to a specific page
- Keep component styles scoped (use CSS modules or inline styles)

### `src/pages/`
Page-level components that represent full views/routes.
- Examples: Home, Adopt, Rescue, Community
- These components compose smaller reusable components from `src/components/`
- Each page can have its own CSS file

### `src/styles/`
Global and shared styling files.
- `global.css` - Reset styles and global defaults
- `variables.css` - Color scheme, fonts, spacing constants
- Other utility or theme stylesheets as needed

### `src/assets/`
Static files like images, icons, and fonts.
- Images, SVGs, and other media files
- Keep this separate from styles
