import Image from 'next/image'
import React from 'react'

function Logo() {
  return (
    <div className='flex items-center justify-center'>
      <Image
      src={"/fav-icon.png"}
      alt='logo Icon'
      width={64}
      height={64}
      className='object-cover'
      />
      <Image
      alt='logo'
      src={"/the-logo.jpg"}
      width={64}
      height={64}
      className='object-cover'
      />
    </div>
  )
}

export default Logo
