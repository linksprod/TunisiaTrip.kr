import { createTranslationApi } from "@/services/translationApi";

// Backward-compat shim for legacy imports. Avoids using React hooks to
// prevent crashes when multiple React copies are accidentally bundled.
export function useTranslationApi() {
  const api = createTranslationApi();

  return {
    setApiKey: api.setApiKey,
    clearApiKey: api.clearApiKey,
    hasApiKey: api.hasApiKey(),
    translate: api.translate,
    // Legacy fields kept for compatibility
    isTranslating: false,
    lastError: null as string | null,
  };
}

export default useTranslationApi;
