import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApertureMark from "@/components/ApertureMark";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center content-card">
          <ApertureMark size={40} className="mx-auto mb-4 text-destructive" />
          <div className="font-mono-label text-destructive mb-2 flex items-center justify-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            Something broke on our end
          </div>
          <p className="text-muted-foreground mb-6">
            This page hit an unexpected error. Your data is safe — reloading usually fixes it.
          </p>
          <Button onClick={this.handleReload} className="bg-primary hover:bg-primary/90">
            Back to BriefLens
          </Button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
