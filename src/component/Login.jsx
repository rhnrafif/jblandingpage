import React, {useState, useEffect, useContext} from 'react'
import {Input, Button, Loading, Modal} from "@nextui-org/react"
import {useForm} from "react-hook-form"
import axios from 'axios';
import {setCookie, getCookie} from "cookies-next";
import { useRouter} from "next/router";
import { LoadingState } from './GlobalState/IsLoadingProvider';

export default function Login() {

    //router
    const router = useRouter();

    //global state
    const [isLoading, setIsLoading] = useContext(LoadingState)

    useEffect(()=>{
        const us = getCookie('dataUser')
        if(us == undefined){
            router.push('/')
        }else{
            const userSession = JSON.parse(us)
            if(userSession.data[0].nama_lengkap == 'ADMIN'){
                router.push('/admin')
                setTimeout(()=>{alert('Anda masih memiliki session log in')}, 2500)
                setIsLoading(true)
            } else {
                let url = userSession.data[0].kode_akses.trim()
                router.push(`/ujian/${url}`)
                setTimeout(()=>{alert('Anda masih memiliki session log in')}, 2500)
                setIsLoading(true)
            } 
        }
    },[])

    // useform
    const {handleSubmit, register, watch, formState:{errors}} = useForm();
    
    
    //login handler
    const submitLogin = async(e)=>{
    
        if(e.kode_akses == ' '){
            alert('Input tidak boleh kosong')
            return
        }

    setIsLoading(!isLoading)

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
                    setIsLoading(false)
                    alert('User tidak ditemukan')
                    document.getElementById('kode_akses').value = ""                    
                    router.push('/')
                }
            }else{
                setIsLoading(false)   
                alert('Login gagal, mohon coba kembali')
                document.getElementById('kode_akses').value = ""
                router.push('/')
            }
        })
    } catch (error) {
        setIsLoading(false)
        alert('Action Failed, Please try again');
    }
  }

  return (
    <>
    {(isLoading) && (
        <>
            <Modal 
            width='120px'
            aria-labelledby="modal-title"
            open={isLoading}
            >
                <Modal.Body>
                    <Loading />
                </Modal.Body>
            </Modal>
        </>
    )}
        <div className="flex flex-col gap-4 items-center">
        <form action="" className="flex flex-col gap-3 md:gap-5 items-center" onSubmit={handleSubmit(submitLogin)}>
            <div className="flex gap-2 items-center justify-between w-full">
                <div className='w-full flex flex-col justify-center items-start gap-1'>
                    <Input clearable label="Kode Akses"  name="kode_akses" width="240px" bordered color='primary' id='kode_akses'
                    
                    {... register("kode_akses", {
                        required : {
                            value : true,
                            message : "Kode Akses wajib diisi"
                        }
                    })}
                    />
                  <div className='flex gap-1 flex-col'>
                    {errors?.kode_akses && <small style={{color : 'red'}}>{ errors?.kode_akses.message}</small>}
                  </div>
                </div>                                        
            </div>
            
            <div>
                    <Button type="submit" color="default" auto>
                    Masuk
                </Button>
            </div>
        </form>
    </div>
    
    </>
  )
}
