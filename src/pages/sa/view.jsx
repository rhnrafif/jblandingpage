import React, { useContext } from 'react'
import Navigation from '@/component/Navigation'
import {useState, useEffect} from "react"
import {Modal, Loading } from "@nextui-org/react";
import axios from 'axios';
import ListKelas from '@/component/ListKelas';
import ListLookup from '@/component/ListLookup';
import { useRouter } from 'next/router';
import {getCookie} from "cookies-next"
import { LoadingState } from '@/component/GlobalState/IsLoadingProvider';
import Image from 'next/image';


export default function uas({data}) {

    //session or user area
    const route = useRouter()
    const [isUserLog, setIsUserLog] = useState(false)
    const [userData, setUserData] = useState({})

    //global state
    const [isLoading, setIsLoading] = useContext(LoadingState)

    const [navLink, setNavLink] = useState({});

    useEffect(() => {
        const us = getCookie('dataUser');
        if (us === undefined) {
            route.push('/');
            return;
        }

        const { data } = JSON.parse(us);
        if (data[0].nama_lengkap === 'SA') {
            setUserData(data[0]);
            setNavLink({input : '/sa', view : '/sa/view'})
            setIsLoading(false);
            setIsUserLog(true);
        } else {
            route.push('/');
            setTimeout(() => {
            alert('Anda BUKAN Super Admin');
            }, 2500);
        }
    }, []);


  // state menu SA
    const [isLookup, setisLookup] = useState(false);
    const [isKelas, setisKelas] = useState(false);
    const [initial, setInitial] = useState(true);

    //hanlde Menu SA
    const handleMenu = (act)=>{
        switch(act)
        {
            case "isLookup":
                setisLookup(true);
                setisKelas(false);
                setInitial(false);
                break;
            case "isKelas":
                setisLookup(false);
                setisKelas(true);
                setInitial(false);
                break;
            default:
                setisLookup(false);
                setisKelas(false);
                setInitial(true);
                break;
        }
    }

    //handle Data Kelas area
    const [dataKelasView, setDataKelasView] = useState([])
    const handleDataKelas = async()=>{
        await axios.get("/api/get/datakelas")
        .then((e)=>{
            setDataKelasView(e.data.data_kelas)
            if(isKelas == false) handleMenu("isKelas")
        })
    }
    
    //hanlde Data Lookup Area
    const [dataLookupView, setDataLookupView] = useState([])
    const handleDataLookup = async()=>{
        await axios.get('/api/get/datalookup')
        .then((e)=>{
            setDataLookupView(e.data)
            if(isLookup == false) handleMenu("isLookup")
        })
    }


  return (
    <>       
        <main className='min-w-full min-h-screen bg-slate-100 text-black' >
            {(isLoading == false) ? (
                <>
                    {(isUserLog) ? (
                        <>
                        <div className="w-full h-fit max-w-[1180px] flex justify-between items-center mx-auto border-b-2 border-gray-700 lg:py-2">
                            <div className="w-[120px]">
                                <Image src={'/logo.svg'} width={80} height={80} alt="logo" />
                            </div>
                            <div className="flex gap-2 w-fit">
                                <Navigation link={navLink} />
                            </div>
                        </div>
                        <div className="container relative min-h-screen flex flex-col items-center gap-2 max-w-[1180px] mx-auto bg-slate-100 mt-5">
                            {(initial) && (
                            <div>
                                <h1 className="text-2xl">Selamat Datang Admin, Have a nice day !</h1>
                            </div>
                            )}
                            <div className="w-full min-h-screen flex flex-col gap-4 mb-5">
                                <div className="text-black w-full h-fit p-3 flex flex-col gap-4">
                                    <h2 className="text-center font-medium text-xl">Pilih Data </h2>
                                    <div className="flex flex-wrap gap-3 justify-center items-center text-white">
                                        <button className="p-4 w-[175px] h-[40px] bg-sky-600 rounded-md flex justify-center items-center" onClick={handleDataLookup}>
                                            <h2> Lookup</h2>
                                        </button>
                                        <button className="p-4 w-[175px] h-[40px] bg-sky-600 rounded-md flex justify-center items-center" onClick={handleDataKelas}>
                                            <h2>Kelas</h2>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-black bg-slate-200 w-[90%] mx-auto h-fit shadow-md rounded-md p-3 ">
        
                                    {(isKelas) && (
                                        <div className='flex flex-col items-center'>
                                            <div>
                                                <p className='font-semibold'>DATA KELAS</p>
                                            </div>
                                            <div className='w-fit'>
                                                <ListKelas dataKelas={dataKelasView}  />
                                            </div>
                                        </div>
                                    )}
        
                                    {(isLookup) && (
                                        <div className='flex flex-col items-center'>
                                            <div>
                                                <p className='font-semibold'>DATA LOOKUP</p>
                                            </div>
                                            <div className='w-fit'>
                                                <ListLookup dataLookup={dataLookupView} />
                                            </div>
                                        </div>
                                    )}
        
                                    {(initial) && (
                                        <h2 className="text-center">Welcome to JayaBuana </h2>
                                    )}
                                </div>
                            </div>
                        </div>
                        </>
                    ) : (
                        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-3">
                            <Image src={'/notall.svg'} width={400} height={400} alt="page not allowed" />
                            <p className="text-2xl">
                                Mohon <a href="/" className="text-sky-600 font-semibold">Login</a> dahulu
                            </p>                   
                        </div>
                    )}
                </>
            ) : (
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
        </main>
        </>
  )
}

export async function getServerSideProps({ req, res }) {

  return {
    props: {
    },
  };
}
