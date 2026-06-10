


"use client";

import {
      createContext,
      useContext,
      useState,
      useEffect,
      useCallback,
      useRef,
      type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type {
      User,
      Session,
      SignInWithPasswordCredentials,
} from "@supabase/supabase-js";
import type { Profile } from "@/lib/types/index";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface AuthContextType {
      user: User | null;
      profile: Profile | null;
      session: Session | null;
      isLoading: boolean;
      isLoggedIn: boolean;
      signIn: (credentials: SignInWithPasswordCredentials) => Promise<void>;
      signUp: (credentials: SignUpCredentials) => Promise<void>;
      signOut: () => Promise<void>;
      updateProfile: (updates: ProfileUpdates) => Promise<Profile | null>;
      refreshProfile: () => Promise<void>;
}

interface SignUpCredentials {
      email: string;
      password: string;
      user_name?: string;
}

interface ProfileUpdates {
      user_name?: string | null;
      role?: string | null;
      avatar_url?: string | null;
      followers?: number | null;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Extracts a display name from Supabase auth user metadata. */
function extractDisplayName(user: User | null): string | null {
      const meta = user?.user_metadata as Record<string, unknown> | undefined;
      for (const key of ["name", "full_name", "first_name"]) {
            const val = meta?.[key];
            if (typeof val === "string" && val.trim()) return val.trim();
      }
      return null;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
      const supabase = createClient();

      const [user, setUser] = useState<User | null>(null);
      const [profile, setProfile] = useState<Profile | null>(null);
      const [session, setSession] = useState<Session | null>(null);
      const [isLoading, setIsLoading] = useState(true);

      // Prevents fetchProfile from being called concurrently for the same user.
      const isFetchingProfile = useRef(false);

      // ─── fetchProfile ───────────────────────────

      /**
       * Fetches or auto-creates the profile row for the given userId.
       *
       * @param userId   - Supabase auth UID
       * @param authUser - The User object already in hand (avoids a redundant getUser() call)
       */
      const fetchProfile = useCallback(
            async (userId: string, authUser: User | null
                  // , email: string
            ) => {
                  // Guard against concurrent calls (e.g. rapid auth state changes)
                  if (isFetchingProfile.current) return;
                  isFetchingProfile.current = true;

                  try {
                        const { data, error } = await supabase
                              .from("profiles")
                              .select("*")
                              .eq("auth_user_id", userId)
                              .single();

                        // ✅ Happy path — profile row exists
                        if (!error && data) {
                              setProfile(data as Profile);
                              return;
                        }

                        // 🔧 Profile row missing — auto-create it
                        if (error?.code === "PGRST116") {
                              const userName = extractDisplayName(authUser);

                              const { data: created, error: createError } = await supabase
                                    .from("profiles")
                                    .insert([{ id: userId, auth_user_id: userId, user_name: userName }])
                                    .select()
                                    .single();

                              if (createError) {
                                    console.error("[AuthContext] Profile creation failed:", createError);
                                    toast.error("Failed to set up your profile. Please refresh.");
                                    setProfile(null);
                                    return;
                              }

                              console.log('Profile: ', profile);
                              setProfile(created as Profile);

                              return;
                        }

                        // ❌ Unexpected DB error
                        console.error("[AuthContext] Profile fetch failed:", error);
                        toast.error("Failed to load your profile. Please refresh.");
                        setProfile(null);
                  } finally {
                        isFetchingProfile.current = false;
                  }
            },
            [supabase]
      );

      // ─── Bootstrap session on mount ─────────────

      useEffect(() => {
            let mounted = true;

            const bootstrap = async () => {
                  const {
                        data: { session },
                        error,
                  } = await supabase.auth.getSession();

                  if (error) {
                        console.error("[AuthContext] getSession error:", error);
                  }

                  if (!mounted) return;

                  setSession(session);
                  setUser(session?.user ?? null);

                  if (session?.user) {
                        await fetchProfile(session.user.id, session.user);
                  }

                  setIsLoading(false);
            };

            bootstrap();

            // ─── Auth state listener ───────────────────

            const {
                  data: { subscription },
            } = supabase.auth.onAuthStateChange(async (event, session) => {
                  if (!mounted) return;

                  // Ignore token refreshes — profile hasn't changed
                  if (event === "TOKEN_REFRESHED") return;

                  setSession(session);
                  setUser(session?.user ?? null);

                  if (session?.user) {
                        await fetchProfile(session.user.id, session.user);
                  } else {
                        setProfile(null);
                  }
            });

            return () => {
                  mounted = false;
                  subscription.unsubscribe();
            };

      }, [fetchProfile, supabase]);

      // ─── Auth actions ────────────────────────────

      const signIn = async (credentials: SignInWithPasswordCredentials) => {
            const { error } = await supabase.auth.signInWithPassword(credentials);
            if (error) throw error;
            toast.success("Signed in successfully!");
      };

      const signUp = async ({ email, password, user_name }: SignUpCredentials) => {
            const { data, error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                        data: { name: user_name ?? null },
                  },
            });

            if (error) throw error;

            // Eagerly create the profiles row so it exists before the first fetchProfile call.
            const userId = data?.user?.id;
            if (userId) {
                  const { error: upsertError } = await supabase
                        .from("profiles")
                        .upsert({
                              id: userId,
                              auth_user_id: userId,
                              user_name: user_name ?? email.split('@')[0]
                        });

                  if (upsertError) {
                        // Non-fatal — fetchProfile will auto-create it on first load.
                        console.error("[AuthContext] Profile upsert after signUp failed:", upsertError);
                  }
            }

            toast.success("Account created! Check your email to confirm.");
      };

      const signOut = async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                  console.error("[AuthContext] signOut error:", error);
                  toast.error("Sign out failed. Please try again.");
                  return;
            }
            // State is cleared by the onAuthStateChange listener — no need to do it here.
            toast.success("Signed out.");
      };

      // ─── Profile mutation ────────────────────────

      const updateProfile = async (updates: ProfileUpdates): Promise<Profile | null> => {
            if (!user) throw new Error("[AuthContext] updateProfile called without an authenticated user.");

            // Update auth metadata if display name changed
            if (updates.user_name !== undefined) {
                  const { error: metaError } = await supabase.auth.updateUser({
                        data: { name: updates.user_name },
                  });
                  if (metaError) {
                        // Non-fatal — profiles table is the source of truth
                        console.error("[AuthContext] Auth metadata update failed:", metaError);
                  }
            }

            const { data: updated, error } = await supabase
                  .from("profiles")
                  .update(updates as any)
                  .eq("auth_user_id", user.id)
                  .select()
                  .single();

            if (error) {
                  console.error("[AuthContext] Profile update failed:", error);
                  throw error;
            }

            // Merge a resolved display name so consumers always have `profile.name`
            const merged: Profile = {
                  ...updated,
                  user_name:
                        updated.user_name ??
                        extractDisplayName(user) ??
                        user.email?.split("@")[0] ??
                        null,
            };

            setProfile(merged);
            return merged;
      };

      // ─── refreshProfile ──────────────────────────

      const refreshProfile = useCallback(async () => {
            if (user) await fetchProfile(user.id, user);
      }, [user, fetchProfile]);

      // ─── Context value ───────────────────────────

      const value: AuthContextType = {
            user,
            profile,
            session,
            isLoading,
            isLoggedIn: !!session,
            signIn,
            signUp,
            signOut,
            updateProfile,
            refreshProfile,
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useAuth() {
      const ctx = useContext(AuthContext);
      if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
      return ctx;
}