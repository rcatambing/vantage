import { OverlayToaster } from "@blueprintjs/core";

/** App-wide singleton toaster. Await before calling .show() */
export const appToaster = OverlayToaster.createAsync({ position: "top" });
