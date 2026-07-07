import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('asa_user')
    const token = localStorage.getItem('asa_token')
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persistSession(data)
    return data
  }

  const register = async (fullName, email, password) => {
    const { data } = await api.post('/auth/register', { fullName, email, password })
    persistSession(data)
    return data
  }

  const persistSession = (data) => {
    localStorage.setItem('asa_token', data.token)
    const userObj = { userId: data.userId, fullName: data.fullName, email: data.email }
    localStorage.setItem('asa_user', JSON.stringify(userObj))
    setUser(userObj)
  }

  const logout = () => {
    localStorage.removeItem('asa_token')
    localStorage.removeItem('asa_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
