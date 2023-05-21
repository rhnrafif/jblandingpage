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

    useEffect(() => {
        const us = getCookie('dataUser');
        if (!us) {
            router.push('/');
            return;
        }

        const { data } = JSON.parse(us);
        const { nama_lengkap, kode_akses } = data[0];

        if (nama_lengkap === 'ADMIN' || nama_lengkap === 'SA') {
            if(nama_lengkap === 'SA') return router.push('/sa');
            if(nama_lengkap === 'ADMIN') return router.push('/admin');
        } else {
            const url = kode_akses.trim();
            router.push(`/ujian/${url}`);
        }

        setTimeout(() => {
            alert('Anda masih memiliki session log in');
        }, 2500);

        setIsLoading(true);
    }, []);


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

        try {
            const { data } = await axios.post("/api/get/login", dataInput);
            if (data.data.length === 0) {
                setIsLoading(false);
                alert("User tidak ditemukan");
                return router.push("/");
            }
            const { nama_lengkap, kode_akses } = data.data[0];
            if (nama_lengkap === "ADMIN") {
                setCookie("dataUser", data);
                return router.push("/admin");
            }
            if(nama_lengkap === "SA"){
                setCookie("dataUser", data);
                return router.push("/sa")
            }
            setCookie("dataUser", data);
            return router.push(`/ujian/${kode_akses.trim()}`);
        } catch (error) {
            setIsLoading(false);
            alert("Action Failed, Please try again");
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
        <form action="" className="flex flex-col gap-3 sm:gap-5 items-center" onSubmit={handleSubmit(submitLogin)}>
            <div className="flex gap-2 items-center justify-between w-full">
                <div className='w-full flex flex-col justify-center items-start gap-1'>
                    <Input clearable  name="kode_akses"  borderWeight='light' bordered rounded placeholder='Masukan username anda disini' className='text-red-700'
                    css={{
                    width:'206px',
                    backgroundColor : '$white',
                    placeContent : "center",
                    '& input': {
                        fontSize : "10px", 
                        textAlign : "center"
                    },
                    '@xs' : {
                        width : "420px",
                        '& input': {
                            fontSize : "16px",
                        },
                    },
                    }}
                    
                    {... register("kode_akses", {
                        required : {
                            value : true,
                            message : "Kode Akses wajib diisi"
                        }
                    })}
                    />
                  <div className='flex gap-1 flex-col'>
                    {errors?.kode_akses && <small style={{color : 'red', fontSize : '10px'}}>{ errors?.kode_akses.message}</small>}
                  </div>
                </div> 
            </div>
            {/* <div className="flex gap-2 items-center justify-between w-full">
                <div className='w-full flex flex-col justify-center items-start gap-1'>
                    <input type="text" name="kode_akses" className='rounded-lg'
                    
                    {... register("kode_akses", {
                        required : {
                            value : true,
                            message : "Kode Akses wajib diisi"
                        }
                    })}
                    />
                  <div className='flex gap-1 flex-col'>
                    {errors?.kode_akses && <small style={{color : 'red', fontSize : '10px'}}>{ errors?.kode_akses.message}</small>}
                  </div>
                </div> 
            </div> */}
            
            <div className='mt-2'>
                    <Button type="submit" auto
                    css={{
                        backgroundColor : '#161F35',
                        borderRadius : '25px',
                        height : '30px',
                        width : '80px',
                        fontWeight : "$semibold",
                        '@xs' : {
                            width : "138px",
                            height : "50px",
                            fontSize : "20px"
                        }
                    }}
                    >
                    Masuk
                </Button>
            </div>
        </form>
    </div>
    
    </>
  )
}
