import { lazy, Suspense } from 'react';
import { RemoteBoundary } from './RemoteBoundary';
import './widget.css';

const Shared = lazy(() => import('shared/Widget'));
const Widget3 = lazy(() => import('widget3/Widget'));

export type WidgetProps = {
  className?: string;
  title?: string;
};

const notes = ['Loads shared', 'Loads widget 3'];

const expectedProps = `{
  className?: string
  title?: string
}`;

export default function Widget({ className, title = 'Widget 1' }: WidgetProps) {
  return (
    <section className={className ? `w1 ${className}` : 'w1'}>
      <h2 className="w1__title">{title}</h2>
      <pre className="widget-props">{expectedProps}</pre>
      <ul className="w1__notes">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <RemoteBoundary className="w1__status">
        <Suspense fallback={<p className="w1__status">Loading…</p>}>
          <Shared label="Shared from widget 1" />
        </Suspense>
      </RemoteBoundary>
      <RemoteBoundary className="w1__status">
        <Suspense fallback={<p className="w1__status">Loading…</p>}>
          <Widget3 title="Widget 3 from widget 1" />
        </Suspense>
      </RemoteBoundary>
    </section>
  );
}
