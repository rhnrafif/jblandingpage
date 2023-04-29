import React from 'react'
import Link from 'next/link'
import { Button } from '@nextui-org/react'
import {getCookie, deleteCookie} from "cookies-next"
import { useRouter } from 'next/router'

export default function Navigation() {
  const route = useRouter();
  const handleLogout = ()=>{
    deleteCookie('dataUser')
    alert('Anda Berhasil Log out')
    route.push('/')
  }
  return (
        <>
        <Link className="text-lg h-[40px] w-[120px] flex justify-center items-center rounded-md hover:bg-sky-600 hover:text-white" 
        href={'/admin'}>Input Menu</Link>
        <Link className="text-lg h-[40px] w-[120px] flex justify-center items-center rounded-md hover:bg-sky-600 hover:text-white" 
        href={'/admin/view'}>Data View</Link>
        <Button
        auto
        onClick={handleLogout}
        >
          Log out
        </Button>
        </>
  )
}
