"use client";

import {
      createContext,
      useContext,
      useState,
      useEffect,
      useCallback,
      type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { User, Session, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types/index";


interface AuthContextType {
      user: User | null;
      profile: Profile | null;
      session: Session | null;
      isLoading: boolean;
      isLoggedIn: boolean;
      signIn: (credentials: SignInWithPasswordCredentials) => Promise<void>;
      signUp: (credentials: SignUpWithPasswordCredentials) => Promise<void>;
      signInWithOAuth: (provider: 'google' | 'facebook') => Promise<void>;
      signOut: () => Promise<void>;
      refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
      const supabase = createClient();

      const [user, setUser] = useState<User | null>(null);
      const [profile, setProfile] = useState<Profile | null>(null);
      const [session, setSession] = useState<Session | null>(null);
      const [isLoading, setIsLoading] = useState(true);

      /* fetch profile based on user id*/
      const fetchProfile = useCallback(
            async (userId: string) => {
                  const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", userId)
                        .single();

                  if (error) {
                        if (error.code === "PGRST116") {
                              const { data: created } = await supabase
                                    .from("profiles")
                                    .insert([{ id: userId }])
                                    .select()
                                    .single();
                              setProfile(created ?? null);
                        } else {
                              console.error("Profile fetch error:", error);
                        }
                        return;
                  }
                  setProfile(data);
            },
            [supabase]
      );

      useEffect(() => {
            let mounted = true;

            const init = async () => {
                  const {
                        data: { session },
                  } = await supabase.auth.getSession();

                  if (!mounted) return;
                  setSession(session);
                  setUser(session?.user ?? null);

                  if (session?.user) await fetchProfile(session.user.id);
                  setIsLoading(false);
            };

            init();

            const {
                  data: { subscription },
            } = supabase.auth.onAuthStateChange(async (_event, session) => {
                  if (!mounted) return;
                  setSession(session);
                  setUser(session?.user ?? null);

                  if (session?.user) {
                        await fetchProfile(session.user.id);
                  } else {
                        setProfile(null);
                  }
            });

            return () => {
                  mounted = false;
                  subscription.unsubscribe();
            };
      }, [fetchProfile, supabase]);

      const signIn = async (credentials: SignInWithPasswordCredentials) => {
            const { error } = await supabase.auth.signInWithPassword(credentials);
            if (error) throw error;
            toast.success("Successfully signed in!");
      };

      const signUp = async (credentials: SignUpWithPasswordCredentials) => {
            const { error } = await supabase.auth.signUp(credentials);
            if (error) throw error;
            toast.success("Registration successful! Check your email.");
      };

      const signInWithOAuth = async (provider: 'google' | 'facebook') => {
            const { error } = await supabase.auth.signInWithOAuth({
                  provider,
                  options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                  },
            });
            if (error) throw error;
      };

      const signOut = async () => {
            await supabase.auth.signOut();
            toast.success("Signed out successfully");
      };

      const refreshProfile = async () => {
            if (user) await fetchProfile(user.id);
      };

      return (
            <AuthContext.Provider
                  value={{
                        user,
                        profile,
                        session,
                        isLoading,
                        isLoggedIn: !!session,
                        signIn,
                        signUp,
                        signInWithOAuth,
                        signOut,
                        refreshProfile,
                  }}
            >
                  {children}
            </AuthContext.Provider>
      );
}

export function useAuth() {
      const ctx = useContext(AuthContext);
      if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
      return ctx;
}