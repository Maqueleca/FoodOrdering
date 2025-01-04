
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "../app/lib/supabase";
import { Session } from "@supabase/supabase-js";
import React from 'react';

type AuthData = {
    session: Session | null;
    loading: boolean;
};

const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
});

export default function AuthProvider({children}: PropsWithChildren){
   const [session, setSession] = useState<Session | null>(null);
   const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchSession = async () =>{
            const {data} = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        }
        fetchSession();
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

   return <AuthContext.Provider value={{session, loading}}>{children}</AuthContext.Provider>;
}
 
export const useAuth= ()=>useContext(AuthContext); 

/*
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../app/lib/supabase'
import { AuthContextType, AuthState } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
  })

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
      }))
    })

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }))
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    ...state,
    signOut: async () => {
      await supabase.auth.signOut()
    },
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}*/