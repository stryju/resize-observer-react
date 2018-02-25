// @flow

import invariant from "invariant";
import * as React from "react";
import { render } from "react-dom";

import type { DOMRectReadOnly } from "./src";
import ResizeObserver from "./src";

type State = {
  rect1: ?DOMRectReadOnly,
  rect2: ?DOMRectReadOnly
};

class Demo extends React.Component<{}, State> {
  state = {
    rect1: null,
    rect2: null
  };

  render(): React.Element<"section"> {
    return (
      <section>
        <ResizeObserver onResize={this._onResize1}>
          {ref => (
            <textarea
              readOnly={true}
              ref={ref}
              value={JSON.stringify(this.state.rect1, null, 2)}
            />
          )}
        </ResizeObserver>
        <ResizeObserver onResize={this._onResize2}>
          {ref => (
            <textarea
              readOnly={true}
              ref={ref}
              value={JSON.stringify(this.state.rect2, null, 2)}
            />
          )}
        </ResizeObserver>
      </section>
    );
  }

  _onResize1 = rect1 => this.setState({ rect1 });
  _onResize2 = rect2 => this.setState({ rect2 });
}

const container = document.getElementById("demo");

invariant(container != null, "demo container not fond");
render(<Demo />, container);
