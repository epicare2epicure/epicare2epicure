import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  currentUser: Profile | null;
  supabaseUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        const user = (await supabase.auth.getUser()).data.user;
        if (user) {
          const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({ id: userId, name, email: user.email })
            .select()
            .single();
          
          if (newProfile) setCurrentUser(newProfile);
        }
      } else {
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) return { success: false, message: error.message };

      if (data.user) {
        await supabase.from('profiles').insert({ id: data.user.id, name, email });
        if (data.session) {
          setCurrentUser({ id: data.user.id, name, email, created_at: new Date().toISOString() });
        }
      }
      return { success: true, message: 'Account created successfully!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'An error occurred' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message === 'Invalid login credentials') {
          return { success: false, message: 'Invalid email or password' };
        }
        return { success: false, message: error.message };
      }
      if (data.user) await loadProfile(data.user.id);
      return { success: true, message: 'Welcome back!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'An error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSupabaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, supabaseUser, isAuthenticated: !!supabaseUser, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
