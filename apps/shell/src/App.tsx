import { lazy, Suspense } from 'react';
import { RemoteBoundary } from './RemoteBoundary';

const Menu = lazy(() => import('menu/Widget'));
const Shared = lazy(() => import('shared/Widget'));
const Widget1 = lazy(() => import('widget1/Widget'));
const Widget2 = lazy(() => import('widget2/Widget'));
const Widget3 = lazy(() => import('widget3/Widget'));

type AppProps = {
  className?: string;
};

export function App({ className }: AppProps) {
  return (
    <main className={className ? `shell ${className}` : 'shell'}>
      <h1 className="shell__title">Shell</h1>
      <RemoteBoundary className="shell__status">
        <Suspense fallback={<p className="shell__status">Loading…</p>}>
          <Menu items="Overview,Widgets,Settings" />
        </Suspense>
      </RemoteBoundary>
      <RemoteBoundary className="shell__status">
        <Suspense fallback={<p className="shell__status">Loading…</p>}>
          <Shared label="Shared from shell" />
        </Suspense>
      </RemoteBoundary>
      <div className="shell__widgets">
        <RemoteBoundary className="shell__status">
          <Suspense fallback={<p className="shell__status">Loading…</p>}>
            <Widget1 title="Widget 1 from shell" />
          </Suspense>
        </RemoteBoundary>
        <RemoteBoundary className="shell__status">
          <Suspense fallback={<p className="shell__status">Loading…</p>}>
            <Widget2 title="Widget 2 from shell" />
          </Suspense>
        </RemoteBoundary>
        <RemoteBoundary className="shell__status">
          <Suspense fallback={<p className="shell__status">Loading…</p>}>
            <Widget3 title="Widget 3 from shell" />
          </Suspense>
        </RemoteBoundary>
      </div>
    </main>
  );
}
