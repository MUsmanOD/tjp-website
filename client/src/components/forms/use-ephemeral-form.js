"use client";

import { useEffect, useRef } from "react";

export function useEphemeralForm() {
  const ref = useRef(null);
  useEffect(() => {
    const form = ref.current;
    // Next's Activity cache hides routes instead of always unmounting them.
    // Effect cleanup also runs when hidden, so personal details do not survive navigation.
    return () => form?.reset();
  }, []);
  return ref;
}
