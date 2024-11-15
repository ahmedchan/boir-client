import React from 'react'

function SolidHeading({title, subTitle}) {
  return (
<div className="container-fluid bg-primary text-white text-center py-5">
    <h1 className="display-4 mt-lg-5">{title}</h1>
    <p className="lead">{subTitle}</p>
  </div>  
  )
}

export default SolidHeading