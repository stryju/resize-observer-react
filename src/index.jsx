// @flow

import * as React from "React";
import ResizeObserver from "resize-observer-polyfill";

type Props = {|
  children: (ref: React.Ref<*>) => React.Node,
  onResize: ResizeHandler
|};
type ResizeHandler = (rect: DOMRectReadOnly, element: Element) => mixed;
export type DOMRectReadOnly = {
  +x: number,
  +y: number,
  +width: number,
  +height: number,
  +top: number,
  +right: number,
  +bottom: number,
  +left: number
};

type State = {
  ref: ?Ref
};
type Ref = React.ElementRef<typeof Element>;

export default class ResizeObserved extends React.PureComponent<Props, State> {
  state = { ref: null };

  render(): React.Node {
    return this.props.children((ref: ?Ref): void => {
      this.setState(state => (state.ref !== ref ? { ref } : null));
    });
  }

  componentDidMount(): void {
    addObserverListener(this.state.ref, this.props.onResize);
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (prevState.ref !== this.state.ref) {
      removeObserverListener(prevState.ref);
      addObserverListener(this.state.ref, this.props.onResize);
    } else if (prevProps.onResize !== this.props.onResize) {
      replaceObserverListener(this.state.ref, this.props.onResize);
    }
  }

  componentWillUnmount(): void {
    removeObserverListener(this.state.ref);
  }
}

// helpers

let observations: Map<Element, ResizeHandler> = new Map();

const observer: ResizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    try {
      const cb = observations.get(entry.target);
      if (cb != null) {
        cb(entry.contentRect, entry.target);
      }
    } catch (err) {
      // whoops?
    }
  }
});

function addObserverListener(ref: ?Ref, onResize: ResizeHandler): void {
  if (ref == null || observations.has(ref)) {
    return;
  }
  observations.set(ref, onResize);
  observer.observe(ref);
}

function replaceObserverListener(ref: ?Ref, onResize: ResizeHandler): void {
  if (ref == null) {
    return;
  }
  observations.set(ref, onResize);
}

function removeObserverListener(ref: ?Ref): void {
  if (ref == null || !observations.has(ref)) {
    return;
  }
  observer.unobserve(ref);
  observations.delete(ref);
}
