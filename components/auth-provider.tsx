'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import { NotificationsProvider } from './notifications-provider'
import { TourProvider } from './tour-provider'
import { auth, getFirebaseAuth } from '@/lib/firebase'
import { initializeSavedQuestionsCache } from '@/lib/firebase-saved-questions'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { getAuthConfig, isAnonymousUser } from '@/lib/auth-config'

interface User {
  uid: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: any | null
  loading: boolean
  loginWithEmail?: (email: string, password: string) => Promise<void>
  signupWithEmail?: (email: string, password: string, name: string) => Promise<void>
  loginAnonymously?: () => Promise<void>
  logout?: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const config = getAuthConfig()

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    ;(async () => {
      try {
        const { getFirebaseAuth } = await import('@/lib/firebase')
        const { onAuthStateChanged } = await import('firebase/auth')
        const auth = await getFirebaseAuth()

        if (!auth) {
          setLoading(false)
          return
        }

        unsubscribe = onAuthStateChanged(auth, currentUser => {
          setUser(currentUser)
          setLoading(false)
        })
      } catch (e) {
        console.error('Auth setup error:', e)
        setLoading(false)
      }
    })()

    return () => unsubscribe?.()
  }, [])

  const loginWithEmail = async (email: string, password: string) => {
    if (!config.emailPassword) {
      throw new Error('Email/password authentication is not enabled')
    }
    
    try {
      const { getFirebaseAuth } = await import('@/lib/firebase')
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const auth = await getFirebaseAuth()

      if (!auth) throw new Error('Firebase not initialized')
      
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      throw new Error(err.message || 'Failed to sign in with email')
    }
  }

  const signupWithEmail = async (email: string, password: string, name: string) => {
    if (!config.emailPassword) {
      throw new Error('Email/password authentication is not enabled')
    }
    
    try {
      const { getFirebaseAuth } = await import('@/lib/firebase')
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
      const auth = await getFirebaseAuth()

      if (!auth) throw new Error('Firebase not initialized')
      
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: name })
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create account')
    }
  }

  const loginAnonymously = async () => {
    if (!config.anonymous) {
      throw new Error('Anonymous authentication is not enabled')
    }

    try {
      const { getFirebaseAuth } = await import('@/lib/firebase')
      const { signInAnonymously } = await import('firebase/auth')
      const auth = await getFirebaseAuth()

      if (!auth) throw new Error('Firebase not initialized')
      
      await signInAnonymously(auth)
    } catch (err: any) {
      throw new Error(err.message || 'Failed to sign in anonymously')
    }
  }

  const logout = async () => {
    try {
      const { getFirebaseAuth } = await import('@/lib/firebase')
      const { signOut } = await import('firebase/auth')
      const auth = await getFirebaseAuth()

      if (auth) {
        await signOut(auth)
      }
      
      localStorage.removeItem('user')
      localStorage.removeItem('viewed_notifications')
      setUser(null)
    } catch (err: any) {
      console.error('Logout error:', err)
      throw new Error(err.message || 'Failed to logout')
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const { getFirebaseAuth } = await import('@/lib/firebase')
        const { onAuthStateChanged } = await import('firebase/auth')
        const auth = await getFirebaseAuth()
        
        if (!auth) return
        
        onAuthStateChanged(auth, async (user) => {
          if (user && !isAnonymousUser(user)) {
            await initializeSavedQuestionsCache()
          }
        })
      } catch (err) {
        console.error('Error initializing saved questions cache:', err)
      }
    })()
  }, [])

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading,
        loginWithEmail,
        signupWithEmail,
        loginAnonymously,
        logout,
      }}
    >
      <NotificationsProvider>
        <TourProvider>
          {children}
        </TourProvider>
      </NotificationsProvider>
    </AuthContext.Provider>
  )
}
