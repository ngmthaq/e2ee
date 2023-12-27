import { E2EE } from "./index";

declare global {
  interface Window {
    E2EE: typeof E2EE;
  }
}
