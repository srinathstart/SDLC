import React from 'react'
import ProfileProductCard from '../components/ProfileProductCard'
import Sidebar from '../components/Sidebar'

const MyProducts = () => {
  return (
    <div className='d-flex '>
      <div style={{ width: '25%' }}>
        <Sidebar />
      </div>
      <div style={{ padding: '1rem', width: '70%' }}>
      <ProfileProductCard/>
      </div>
    </div>
    
  )
}

export default MyProducts