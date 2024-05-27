'use client'

import React from 'react'
import HelloUsers from '../../../components/helloUsers/HelloUsers';
import username from '../../../components/login/HandleLogin'

function page({username}) {
  return (
    <div>
      trabajador
      <HelloUsers username ={username} />
    </div>
  )
}

export default page;