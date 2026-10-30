import { PAGES, findPage } from './pages';

// Cada página es un HTML propio (prerenderizado); la navegación entre páginas es con enlaces normales.
export default function App({ path }) {
  return (findPage(path) || PAGES[0]).render();
}
