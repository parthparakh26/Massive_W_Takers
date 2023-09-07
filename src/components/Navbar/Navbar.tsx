import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <div className='header'>
        <div className='logo'>LOGO</div>
        <div className='button-stack'>
          <button className='login-button'>Log in</button>
          <Link to="/mcq"><button className='signup-button'>Sign up</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar;