import React, {useState, useEffect} from 'react'
import {Input, Button} from "@nextui-org/react"
import {useForm} from "react-hook-form"
import axios from 'axios';
import {setCookie, getCookie} from "cookies-next";
import { useRouter} from "next/router";

export default function Login() {

    //router
    const router = useRouter();

    useEffect(()=>{
        const us = getCookie('dataUser')
        if(us == undefined){
            router.push('/')
        }else{
            const userSession = JSON.parse(us)
            if(userSession.data[0].nama_lengkap == 'ADMIN'){
                router.push('/admin')
                setTimeout(()=>{alert('Anda masih memiliki session log in')}, 2500)
            } else {
                let url = userSession.data[0].kode_akses.trim()
                router.push(`/ujian/${url}`)
                setTimeout(()=>{alert('Anda masih memiliki session log in')}, 2500)
            } 
        }
    },[])

    // useform
    const {handleSubmit, register} = useForm();
    
    
    //login handler
    const submitLogin = async(e)=>{

    const dataInput = {
        value : e.kode_akses
    }

    //area hit API
    try {
        await axios.post("/api/get/login", dataInput)
        .then((res)=>{
            if(res.status === 200){
                if(res.data.data.length != 0){
                    if(res.data.data[0].nama_lengkap == "ADMIN"){
                        setCookie('dataUser', res.data)
                        router.push('/admin')
                    }else{
                        let url = res.data.data[0].kode_akses.trim()
                        setCookie('dataUser', res.data)
                        router.push(`/ujian/${url}`)
                    }
                }else{
                    alert('User tidak ditemukan')
                    document.getElementById('kode_akses').value = ""                    
                    router.push('/')
                }
            }else{
                alert('Login gagal, mohon coba kembali')   
                document.getElementById('kode_akses').value = ""
                router.push('/')
            }
        })
    } catch (error) {
        alert('Action Failed, Please try again');
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <form action="" className="flex flex-col gap-3 md:gap-5 items-center" onSubmit={handleSubmit(submitLogin)}>
          <div className="flex gap-2 items-center justify-between w-full">
              <Input clearable label="Kode Akses"  name="kode_akses" width="240px" bordered color='primary' id='kode_akses'
              
              {... register("kode_akses")}
              />                                        
          </div>
          
          <div>
                <Button type="submit" color="default" auto>
                  Masuk
              </Button>
          </div>
      </form>
  </div>
  )
}
