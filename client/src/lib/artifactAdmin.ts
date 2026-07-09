import { useEffect, useState } from "react";

const ADMIN_STORAGE_KEY = "viktor-artifact-admin";
const ADMIN_TOKEN = "viktor";

/** Dev = always admin. Prod = once via ?admin=viktor, then persisted in localStorage. */
export function useArtifactAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(() => import.meta.env.DEV);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsAdmin(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("admin");

    if (token === ADMIN_TOKEN) {
      localStorage.setItem(ADMIN_STORAGE_KEY, "1");
      params.delete("admin");
      const query = params.toString();
      const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", next);
    }

    setIsAdmin(localStorage.getItem(ADMIN_STORAGE_KEY) === "1");
  }, []);

  return isAdmin;
}
