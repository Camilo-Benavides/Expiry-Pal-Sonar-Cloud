/*
  App routing. Adds routes for splash, login and signup.
*/
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Register from './pages/Register'
import MyFridges from './pages/MyFridges'
import AddFridge from './pages/AddFridge'
import Fridge from './pages/Fridge'
import ProductDetails from './pages/ProductDetails'
import Recipes from './pages/Recipes'
import RecipeDetails from './pages/RecipeDetails'
import AccessibilityButton from './components/accessibility/AccessibilityButton'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/my-fridges" element={<MyFridges />} />
        <Route path="/add-fridge" element={<AddFridge />} />
  <Route path="/fridge" element={<Fridge />} />
  <Route path="/fridge/:id" element={<Fridge />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
      </Routes>
      {/* Accessibility controls always mounted so preferences persist and the FAB is visible on all pages */}
      <AccessibilityButton />
      {/* Mobile bottom navigation rendered inside the Router so Links work */}
      
    </Router>
  )
}

export default App
