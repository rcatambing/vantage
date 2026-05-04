import { Component, type ReactNode } from "react";
import { NonIdealState, Button } from "@blueprintjs/core";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class CampaignErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <NonIdealState
            icon="error"
            title="Something went wrong"
            description="Reload the page or go back to campaigns."
            action={
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  icon="refresh"
                  text="Reload page"
                  onClick={() => window.location.reload()}
                  style={{ borderRadius: 0, minHeight: 48 }}
                />
                <Button
                  icon="arrow-left"
                  text="Go back"
                  onClick={() => {
                    window.location.href = "/campaigns";
                  }}
                  style={{ borderRadius: 0, minHeight: 48 }}
                />
              </div>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
