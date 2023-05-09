import React, {useContext} from 'react'
import Link from 'next/link'
import { Button } from '@nextui-org/react'
import {getCookie, deleteCookie} from "cookies-next"
import { useRouter } from 'next/router'
import { LoadingState } from './GlobalState/IsLoadingProvider'

export default function Navigation() {
  const route = useRouter();
  const [isLoading, setIsLoading] = useContext(LoadingState)
  const handleLogout = ()=>{
    deleteCookie('dataUser')
    setIsLoading(false)
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
        flat
        auto
        onClick={handleLogout}
        >
          Log out
        </Button>
        </>
  )
}
