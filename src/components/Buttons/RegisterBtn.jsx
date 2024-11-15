import React from 'react'
import { Link } from 'react-router-dom';

function RegisterBtn({type, value}) {
    let t = type;
  return (
    <Link to={`/auth/register/${type}`} className='btn btn-block btn-primary'>{value}</Link>
    // <Link to={`/register/${type}`} className="btn btn-block btn-primary">{value}</Link>
)
}

export default RegisterBtn