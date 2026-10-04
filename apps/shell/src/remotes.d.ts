declare module 'menu/Widget' {
  import type { FC } from 'react';

  type WidgetProps = {
    className?: string;
    items?: string;
  };

  const Widget: FC<WidgetProps>;
  export default Widget;
}

declare module 'shared/Widget' {
  import type { FC } from 'react';

  type WidgetProps = {
    className?: string;
    label?: string;
  };

  const Widget: FC<WidgetProps>;
  export default Widget;
}

declare module 'widget1/Widget' {
  import type { FC } from 'react';

  type WidgetProps = {
    className?: string;
    title?: string;
  };

  const Widget: FC<WidgetProps>;
  export default Widget;
}

declare module 'widget2/Widget' {
  import type { FC } from 'react';

  type WidgetProps = {
    className?: string;
    title?: string;
  };

  const Widget: FC<WidgetProps>;
  export default Widget;
}

declare module 'widget3/Widget' {
  import type { FC } from 'react';

  type WidgetProps = {
    className?: string;
    title?: string;
  };

  const Widget: FC<WidgetProps>;
  export default Widget;
}
