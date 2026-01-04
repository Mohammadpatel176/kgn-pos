import './index.css'
import { hydrate, render } from 'preact'
import { BrowserRouter } from "react-router-dom";
import { App } from './app'

const container = document.getElementById('app');

if (container) {
  const root = (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // If the server didn't render anything into the div, use render instead of hydrate
  // This prevents the "null reading length" error if the SSR output is empty
  if (container.hasChildNodes()) {
    hydrate(root, container);
  } else {
    render(root, container);
  }
}