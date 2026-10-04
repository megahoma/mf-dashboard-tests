import { lazy, Suspense } from 'react';
import { RemoteBoundary } from './RemoteBoundary';
import './widget.css';

const Shared = lazy(() => import('shared/Widget'));

export type WidgetProps = {
  className?: string;
  items?: string;
};

const fallbackItems = ['Overview', 'Catalog', 'Reports'];

const expectedProps = `{
  className?: string
  items?: string
}`;

function readItems(items?: string) {
  const parsed = items
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return parsed && parsed.length > 0 ? parsed : fallbackItems;
}

export default function Widget({ className, items }: WidgetProps) {
  const links = readItems(items);

  return (
    <nav className={className ? `menu ${className}` : 'menu'}>
      <p className="menu__title">Menu</p>
      <pre className="widget-props">{expectedProps}</pre>
      <ul className="menu__list">
        {links.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <RemoteBoundary className="menu__status">
        <Suspense fallback={<p className="menu__status">Loading…</p>}>
          <Shared label="Shared from menu" />
        </Suspense>
      </RemoteBoundary>
    </nav>
  );
}
