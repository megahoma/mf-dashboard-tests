import { lazy, Suspense } from 'react';
import { RemoteBoundary } from './RemoteBoundary';
import './widget.css';

const Shared = lazy(() => import('shared/Widget'));

export type WidgetProps = {
  className?: string;
  title?: string;
};

const expectedProps = `{
  className?: string
  title?: string
}`;

const rows = [
  { name: 'Alpha', value: '12' },
  { name: 'Beta', value: '7' },
  { name: 'Gamma', value: '3' },
];

export default function Widget({ className, title = 'Widget 2' }: WidgetProps) {
  return (
    <section className={className ? `w2 ${className}` : 'w2'}>
      <h2 className="w2__title">{title}</h2>
      <pre className="widget-props">{expectedProps}</pre>
      <table className="w2__table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <RemoteBoundary className="w2__status">
        <Suspense fallback={<p className="w2__status">Loading…</p>}>
          <Shared label="Shared from widget 2" />
        </Suspense>
      </RemoteBoundary>
    </section>
  );
}
