import { Session, User } from '@supabase/supabase-js'

export interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  // Adicione outros métodos de autenticação conforme necessário
}