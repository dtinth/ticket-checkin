import { injectGlobal } from 'emotion'

export const Fonts = {
  system: [...getSystemFonts()],
  display: [
    'Metropolis',
    'Proxima Nova',
    'Montserrat',
    ...getSystemFonts()
  ].join(', '),
  body: ['Noto Sans', 'Noto Sans Thai UI', ...getSystemFonts()].join(', ')
}

function injectGlobalStyles() {
  function fontFace(src, family, weight) {
    return `@font-face {
      font-family: "${family}";
      font-weight: ${weight};
      src: url(${src}) format('woff2');
    }`
  }

  injectGlobal({
    'html, body': {
      margin: 0,
      padding: 0
    },
    html: {
      font: `16px ${Fonts.body}`,
      background: '#222',
      color: '#e9e9e9'
    },
    a: {
      color: '#00d8ff'
    }
  })

  injectGlobal`
    ${fontFace(
      require('./vendor/fonts/Metropolis-Light.woff2'),
      'Metropolis',
      300
    )}
    ${fontFace(
      require('./vendor/fonts/Metropolis-Regular.woff2'),
      'Metropolis',
      400
    )}
    ${fontFace(
      require('./vendor/fonts/Metropolis-Medium.woff2'),
      'Metropolis',
      500
    )}
    ${fontFace(
      require('./vendor/fonts/Metropolis-SemiBold.woff2'),
      'Metropolis',
      600
    )}
    ${fontFace(
      require('./vendor/fonts/Metropolis-Bold.woff2'),
      'Metropolis',
      700
    )}
    ${fontFace(
      require('./vendor/fonts/NotoSans-Light-Latin.woff2'),
      'Noto Sans',
      300
    )}
    ${fontFace(
      require('./vendor/fonts/NotoSans-Regular-Latin.woff2'),
      'Noto Sans',
      400
    )}
    ${fontFace(
      require('./vendor/fonts/NotoSans-SemiBold-Latin.woff2'),
      'Noto Sans',
      600
    )}
    ${fontFace(
      require('./vendor/fonts/NotoSansThaiUI-Light.woff2'),
      'Noto Sans Thai UI',
      300
    )}
    ${fontFace(
      require('./vendor/fonts/NotoSansThaiUI-Regular.woff2'),
      'Noto Sans Thai UI',
      400
    )}
    ${fontFace(
      require('./vendor/fonts/NotoSansThaiUI-SemiBold.woff2'),
      'Noto Sans Thai UI',
      600
    )}
  `
}

function getSystemFonts() {
  return [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif'
  ]
}

injectGlobalStyles()
