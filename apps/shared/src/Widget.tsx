import './widget.css';

export type WidgetProps = {
  className?: string;
  label?: string;
};

const facts = ['No remotes', 'Static copy'];

const expectedProps = `{
  className?: string
  label?: string
}`;

export default function Widget({ className, label = 'Shared' }: WidgetProps) {
  return (
    <section className={className ? `shared ${className}` : 'shared'}>
      <p className="shared__label">{label}</p>
      <pre className="widget-props">{expectedProps}</pre>
      <ul className="shared__facts">
        {facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
    </section>
  );
}
