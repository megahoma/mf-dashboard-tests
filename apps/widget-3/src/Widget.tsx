import { lazy, Suspense } from 'react';
import { RemoteBoundary } from './RemoteBoundary';
import './widget.css';

const Shared = lazy(() => import('shared/Widget'));

export type WidgetProps = {
  className?: string;
  title?: string;
};

const steps = ['Draft', 'Review', 'Done'];

const expectedProps = `{
  className?: string
  title?: string
}`;

export default function Widget({ className, title = 'Widget 3' }: WidgetProps) {
  return (
    <section className={className ? `w3 ${className}` : 'w3'}>
      <h2 className="w3__title">{title}</h2>
      <pre className="widget-props">{expectedProps}</pre>
      <ol className="w3__steps">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <RemoteBoundary className="w3__status">
        <Suspense fallback={<p className="w3__status">Loading…</p>}>
          <Shared label="Shared from widget 3" />
        </Suspense>
      </RemoteBoundary>
    </section>
  );
}
