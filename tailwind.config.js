/** @type {import('tailwindcss').Config} */

function withOpacityValue (variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}) / ${opacityValue})`
  }
}

module.exports = {
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        mod: {
          bg: withOpacityValue('--sys-bg-rgb'),
          card: withOpacityValue('--sys-card-rgb'),
          btn: withOpacityValue('--sys-primary-rgb'),
          input: withOpacityValue('--sys-input-rgb'),
          'input-hover': withOpacityValue('--sys-input-focus-rgb'),
          'btn-hover': withOpacityValue('--sys-btn-hover-rgb')
        }
      },
      colors: {
        mod: {
          primary: withOpacityValue('--sys-primary-rgb'),
          secondary: withOpacityValue('--sys-secondary-rgb'),
          success: withOpacityValue('--sys-success-rgb'),
          info: withOpacityValue('--sys-info-rgb'),
          warning: withOpacityValue('--sys-warning-rgb'),
          danger: withOpacityValue('--sys-danger-rgb'),
          title: withOpacityValue('--sys-title-color-rgb'),
          subhead: withOpacityValue('--sys-subhead-color-rgb'),
          body: withOpacityValue('--sys-body-color-rgb')
        }
      }
    }
  },
  plugins: []
}
