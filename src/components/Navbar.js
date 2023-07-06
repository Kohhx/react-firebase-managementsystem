import React from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    navigate("/login")
  }

  console.log(user?.email)
  return (
    <div className="navbar-container px-5">
      <h1 className="logo-title">Navbar</h1>
      <div className="flex gap-2">
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/signup">Signup</Link>}
        {user &&
          <>
          Display Name: {user.displayName}
          <button onClick={handleLogout}>Logout</button></>
        }
      </div>
    </div>
  )
}

export default Navbar
