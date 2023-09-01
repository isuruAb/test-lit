# LIT Multi select web component

## Capabilities

- User can select values from the dropdown list by pressing "Enter" or using mouse click.
- User can remove a selected badge by clicking on the 'x' sign on the badge or pressing backspace button. It will not remove the badge if you have typed any value on the field.
- Every time user removes a badge it will restored on the options list.
- When user key in a value in the field, options list will be filtered accordingly.


## Expected properties

- `placeholder`: User need to pass `placeholder` text that shows on the field when there is not any text input.
- `menuList`: these are the options list that shows on the dropdown upon focussing the field.  
- `value`: If user wants to add a predefined value, it should be passed using value property.


## Get Started

Clone the repo. Then install.

```bash
npm install
```

Then start the dev server and rollup watchers

```bash
npm run dev
```

A browser window should open and rollup will watch your files for changes.