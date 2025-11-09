import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Register new user
  const register = async (email, password, displayName) => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      
      // Update user profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        })
      }
      
      return userCredential.user
    } catch (err) {
      // More detailed logging for debugging (shows Firebase error code and message)
      console.error('Auth register error:', err && err.code ? err.code : 'no-code', err && err.message ? err.message : err)
      setError(err.message)
      throw err
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      return userCredential.user
    } catch (err) {
      console.error('Auth login error:', err && err.code ? err.code : 'no-code', err && err.message ? err.message : err)
      setError(err.message)
      throw err
    }
  }

  // Logout user
  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      console.error('Auth logout error:', err && err.code ? err.code : 'no-code', err && err.message ? err.message : err)
      setError(err.message)
      throw err
    }
  }

  // Get Firebase ID token for API requests
  const getIdToken = async () => {
    if (currentUser) {
      try {
        return await currentUser.getIdToken()
      } catch (err) {
        setError(err.message)
        throw err
      }
    }
    return null
  }

  // Sign in with Google popup
  const signInWithGoogle = async () => {
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      console.info('Attempting Google sign-in')
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (err) {
      console.error('Auth Google sign-in error:', err && err.code ? err.code : 'no-code', err && err.message ? err.message : err)
      setError(err.message)
      throw err
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    getIdToken,
    signInWithGoogle,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
