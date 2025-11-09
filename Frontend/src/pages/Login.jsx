import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import SocialAuth from '../components/auth/SocialAuth'
import Logo from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'
import FormError from '../components/ui/FormError'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()
  const { login, signInWithGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    const nextErrors = {}
    if (!email) nextErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email'
    if (!password) nextErrors.password = 'Password is required'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    try {
      await login(email, password)
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
    <AuthLayout title="Log in" subtitle="Enter your credentials to access your fridge.">

      <form className="space-y-3" onSubmit={handleSubmit}>
        <FormError message={formError} />
        <Input id="email" label="Email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" error={errors.email} />
        <Input id="password" label="Password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" error={errors.password} />

        <div className="text-right">
          <a className="text-sm link" href="#">Forgot password?</a>
        </div>

        <Button type="submit" variant="primary" full>Log in</Button>

        <div className="text-center text-sm">
          New user? <Link to="/signup" className="link">Sign Up</Link>
        </div>

  <SocialAuth onGoogle={handleGoogle} onFacebook={()=>{}} googleText="Sign in with Google" facebookText="Continue with Facebook" />

        <div className="small">By continuing, you agree to our Terms & Privacy Policy.</div>
      </form>
    </AuthLayout>
  )
}
