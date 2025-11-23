declare module "react-test-renderer" {
  import { ReactElement } from "react";

  export interface ReactTestRenderer {
    toJSON(): any;
    toTree(): any;
    update(element: ReactElement): void;
    unmount(): void;
    getInstance(): any;
    root: any;
  }

  export function create(
    element: ReactElement,
    options?: any
  ): ReactTestRenderer;

  export function act(callback: () => void): void;
  export function act<T>(callback: () => T): T;
  export function act<T>(callback: () => Promise<T>): Promise<T>;
}
