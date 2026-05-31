export const CALLBACK_REQUEST_EVENT = "phinura:open-callback";

export function openCallbackRequest() {
  window.dispatchEvent(new CustomEvent(CALLBACK_REQUEST_EVENT));
}
