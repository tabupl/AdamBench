import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useAuth } from "./useAuth";
import { isAuthError } from "../AuthContext";

export type SaveStatus = "idle" | "saving" | "success" | "error";

export function useProfile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Re-sync if the user object is replaced (e.g. after login)
  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.id]);

  const isDirty = name !== (user?.name ?? "") || email !== (user?.email ?? "");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isDirty) return;
    setSaveStatus("saving");
    setErrorMessage("");
    try {
      await updateProfile(name, email);
      setSaveStatus("success");
    } catch (err) {
      setSaveStatus("error");
      setErrorMessage(isAuthError(err) ? err.message : "An unexpected error occurred. Please try again.");
    }
  }

  function handleReset() {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setSaveStatus("idle");
    setErrorMessage("");
  }

  return { name, setName, email, setEmail, isDirty, saveStatus, errorMessage, handleSubmit, handleReset };
}
