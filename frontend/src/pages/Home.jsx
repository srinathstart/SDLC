import React from 'react'
import Sidebar from '../components/Sidebar'
import ProductCard from '../components/ProductCard'

const Home = () => {

  return (
    <div className='d-flex '>
      <div style={{ width: '25%' }}>
        <Sidebar />
      </div>
      <div style={{ padding: '1rem', width: '70%' }}>
        <ProductCard />
      </div>

    </div>
  )
}

export default Home