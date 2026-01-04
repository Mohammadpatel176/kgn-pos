import renderToString from 'preact-render-to-string'
import { StaticRouter } from 'react-router-dom/server'
import { App } from './app'

export function render(url) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
  return { html }
}