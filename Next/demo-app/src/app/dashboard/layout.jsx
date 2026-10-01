import React from 'react'
import Dashboard from './page'
import Link from 'next/link'

const layout = ({children}) => {
  return (
    <div>
        {/* <Dashboard /> */}
        <nav style={{
            display:'flex',
            gap:'20px',
            marginLeft:'20px',
            marginTop:'20px',
            textDecoration:'underline',
            fontWeight:'bold',
            border:'1px solid black',
            width:'fit-content',
            padding:'10px'
            }}>
                
                    <Link href='/dashboard/admin'>Admin</Link>
                    <Link href='/dashboard/customer'>Customer</Link>
                </nav>
        {children}
        
    </div>
  )
}

export default layout