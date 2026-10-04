import { createRoot } from 'react-dom/client';
import Widget from './Widget';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found');
}

createRoot(rootElement).render(<Widget title="Widget 1" />);
