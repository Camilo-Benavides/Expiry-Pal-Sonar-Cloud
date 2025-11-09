import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import SocialAuth from '../components/auth/SocialAuth'
import FormError from '../components/ui/FormError'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()
  const { register, signInWithGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    const nextErrors = {}
    if (!name) nextErrors.name = 'Full name is required'
    if (!email) nextErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email'
    if (!password) nextErrors.password = 'Password is required'
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters'
    if (password !== confirm) nextErrors.confirm = 'Passwords do not match'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    try {
      await register(email, password, name)
      navigate('/my-fridges')
    } catch (err) {
      setFormError(err.message || String(err))
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
      navigate('/my-fridges')
    } catch (err) {
      setFormError(err.message || String(err))
    }
  }

  return (
    <AuthLayout title="Sign up" subtitle="Create an account to start using ExpiryPal.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <FormError message={formError} />
        <Input id="name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" error={errors.name} />
        <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" autoComplete="email" error={errors.email} />
        <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" autoComplete="new-password" error={errors.password} />
        <Input id="confirm" label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" autoComplete="new-password" error={errors.confirm} />

        <Button type="submit" variant="primary" full>Create account</Button>

        <div className="text-center text-sm">Already have an account? <Link to="/login" className="link">Log in</Link></div>

  <SocialAuth onGoogle={handleGoogle} onFacebook={()=>{}} googleText="Sign up with Google" facebookText="Continue with Facebook" />
      </form>
    </AuthLayout>
  )
}
