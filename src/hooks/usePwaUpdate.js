import { useCallback, useEffect, useRef, useState } from "react";
import { activateServiceWorkerUpdate, PWA_UPDATE_EVENT } from "../pwa/serviceWorker";

export function formHasUnsavedInput(form) {
  if (!form?.elements) return false;
  return Array.from(form.elements).some((control) => {
    if (control.disabled || ["button", "submit", "reset", "hidden"].includes(control.type)) return false;
    if (control.type === "checkbox" || control.type === "radio") return control.checked !== control.defaultChecked;
    if (control.tagName === "SELECT") return Array.from(control.options).some((option) => option.selected !== option.defaultSelected);
    return control.value !== control.defaultValue;
  });
}

export default function usePwaUpdate(environment = globalThis) {
  const [registration, setRegistration] = useState(null);
  const [deferredForEditing, setDeferredForEditing] = useState(false);
  const lastFormControl = useRef(null);

  useEffect(() => {
    function handleUpdate(event) {
      setRegistration(event.detail.registration);
    }
    function rememberFormControl(event) {
      if (event.target?.closest?.("form")) lastFormControl.current = event.target;
    }
    environment.addEventListener?.(PWA_UPDATE_EVENT, handleUpdate);
    environment.document?.addEventListener?.("focusin", rememberFormControl);
    return () => {
      environment.removeEventListener?.(PWA_UPDATE_EVENT, handleUpdate);
      environment.document?.removeEventListener?.("focusin", rememberFormControl);
    };
  }, [environment]);

  const updateNow = useCallback(() => {
    const form = lastFormControl.current?.isConnected ? lastFormControl.current.closest("form") : null;
    if (formHasUnsavedInput(form)) {
      setDeferredForEditing(true);
      return false;
    }
    setDeferredForEditing(false);
    environment.navigator?.serviceWorker?.addEventListener("controllerchange", () => environment.location.reload(), { once: true });
    activateServiceWorkerUpdate(registration);
    return true;
  }, [environment, registration]);

  return { registration, updateAvailable: Boolean(registration), deferredForEditing, updateNow };
}
