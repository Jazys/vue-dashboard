import { supabase } from './supabase'

export function setupAuthInterceptor() {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      if (session) {
        localStorage.setItem('bearer-token', session!.access_token)
        localStorage.setItem('refresh-token', session!.refresh_token)
        localStorage.setItem('user-id', session.user!.id)
      }
    }
    else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('bearer-token')
      localStorage.removeItem('refresh-token')
      localStorage.removeItem('user-id')
    }
  })

  const refreshSession = async () => {
    const session = await supabase.auth.getSession()
    if (session) {
      const { error } = await supabase.auth.refreshSession()
      if (error)
        console.error('Error refreshing session:', error.message)
    }
  }

  setInterval(refreshSession, 30 * 60 * 1000) // Rafraîchir toutes les 30 minutes
}
