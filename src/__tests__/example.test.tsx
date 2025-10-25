import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Example Test", () => {
  it("should pass a basic test", () => {
    expect(true).toBe(true);
  });

  it("should render text correctly", () => {
    render(<div>Hello World</div>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
