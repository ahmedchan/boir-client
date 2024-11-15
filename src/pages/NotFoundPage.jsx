import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <>
    <div className='text-center'>
      <h1 className='text-warning '><i className="fa fa-warning"></i></h1>
      <h1>Oops!</h1>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className='btn btn-primary'>Back to home page</Link>
    </div>

    </>
  )
}

export default NotFound