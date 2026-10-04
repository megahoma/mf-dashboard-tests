import { Component, type ReactNode } from 'react';

type RemoteBoundaryProps = {
  className: string;
  children: ReactNode;
};

type RemoteBoundaryState = {
  failed: boolean;
};

export class RemoteBoundary extends Component<
  RemoteBoundaryProps,
  RemoteBoundaryState
> {
  state: RemoteBoundaryState = { failed: false };

  static getDerivedStateFromError(): RemoteBoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p className={this.props.className}>Failed to load the microfrontend</p>
      );
    }

    return this.props.children;
  }
}
