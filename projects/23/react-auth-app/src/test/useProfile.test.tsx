import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import type { AuthContextValue, User } from "../types/auth";
import { createAuthError } from "../types/auth";
import { ProfilePage } from "../pages/ProfilePage";

// ── Helpers ───────────────────────────────────────────────────────────────────

const ALICE: User = {
  id: "1",
  name: "Alice Johnson",
  email: "alice@example.com",
  avatarInitials: "AJ",
};

function makeCtx(overrides?: Partial<AuthContextValue>): AuthContextValue {
  return {
    user: ALICE,
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn<(name: string, email: string) => Promise<void>>().mockResolvedValue(undefined),
    ...overrides,
  };
}

function renderProfile(ctxOverrides?: Partial<AuthContextValue>) {
  const ctx = makeCtx(ctxOverrides);
  render(
    <AuthContext.Provider value={ctx}>
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
  return { ctx };
}

// ── Rendering ─────────────────────────────────────────────────────────────────

describe("ProfilePage — rendering", () => {
  it("pre-fills the name field with the current user's name", () => {
    renderProfile();
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Alice Johnson");
  });

  it("pre-fills the email field with the current user's email", () => {
    renderProfile();
    expect(screen.getByLabelText(/email address/i)).toHaveValue("alice@example.com");
  });

  it("shows the user's initials in the account overview", () => {
    renderProfile();
    // The avatar in the overview panel (not the navbar)
    const avatars = screen.getAllByText("AJ");
    expect(avatars.length).toBeGreaterThan(0);
  });

  it("renders the Save changes button as disabled initially (no changes)", () => {
    renderProfile();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeDisabled();
  });

  it("renders the Reset button as disabled initially (no changes)", () => {
    renderProfile();
    expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();
  });
});

// ── Dirty state ───────────────────────────────────────────────────────────────

describe("ProfilePage — dirty state", () => {
  beforeEach(() => vi.clearAllMocks());

  it("enables Save when the name is changed", async () => {
    renderProfile();
    const user = userEvent.setup();
    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Alice Smith");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeEnabled();
  });

  it("enables Save when the email is changed", async () => {
    renderProfile();
    const user = userEvent.setup();
    await user.clear(screen.getByLabelText(/email address/i));
    await user.type(screen.getByLabelText(/email address/i), "new@example.com");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeEnabled();
  });

  it("disables Save again when changes are reverted to original values", async () => {
    renderProfile();
    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Alice Smith");
    // Now revert
    await user.clear(nameInput);
    await user.type(nameInput, "Alice Johnson");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeDisabled();
  });
});

// ── Submission ────────────────────────────────────────────────────────────────

describe("ProfilePage — submission", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls updateProfile with the current field values", async () => {
    const { ctx } = renderProfile();
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Alice Smith");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(ctx.updateProfile).toHaveBeenCalledWith("Alice Smith", "alice@example.com");
    });
  });

  it("shows the success message after a successful save", async () => {
    renderProfile();
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Alice Smith");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/updated successfully/i);
  });

  it("disables Save while saving is in progress", async () => {
    renderProfile({
      updateProfile: vi.fn().mockReturnValue(new Promise(() => {})),
    });
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Alice Smith");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    // While the promise is pending the button shows a spinner (no text), so
    // query by type="submit" instead of name, and assert it is disabled.
    await waitFor(() => {
      const submitBtn = document.querySelector('button[type="submit"]');
      expect(submitBtn).toBeDisabled();
    });
  });

  it("shows an AuthError message on failure", async () => {
    renderProfile({
      updateProfile: vi.fn().mockRejectedValue(
        createAuthError("EMAIL_TAKEN", "That email address is already in use."),
      ),
    });
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/email address/i));
    await user.type(screen.getByLabelText(/email address/i), "taken@example.com");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "That email address is already in use.",
    );
  });

  it("shows a generic message for unexpected errors", async () => {
    renderProfile({
      updateProfile: vi.fn().mockRejectedValue(new Error("Network error")),
    });
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Alice Smith");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/unexpected error/i);
  });
});

// ── Reset ─────────────────────────────────────────────────────────────────────

describe("ProfilePage — reset", () => {
  beforeEach(() => vi.clearAllMocks());

  it("restores original values when Reset is clicked", async () => {
    renderProfile();
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Changed Name");
    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Alice Johnson");
  });

  it("clears an error message when Reset is clicked", async () => {
    renderProfile({
      updateProfile: vi.fn().mockRejectedValue(
        createAuthError("EMAIL_TAKEN", "Email taken."),
      ),
    });
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/email address/i));
    await user.type(screen.getByLabelText(/email address/i), "taken@example.com");
    await user.click(screen.getByRole("button", { name: /save changes/i }));
    await screen.findByRole("alert");

    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
