import React from 'react';
import './CardPricingStyle.css'

export default function CardForPricing({children}) {
  return (
<div className="col-lg-4">
        <div className="card cardAnimate mb-5 mb-lg-0">
          <div className="card-body">
            
            {children}

          </div>
        </div>
      </div>
      
    )
}
