import React from 'react'
import Navigation from '@/component/Navigation'
import {useState, useMemo, useEffect} from "react"
import {  Dropdown, Button } from "@nextui-org/react";
import ListSiswa from '@/component/ListSiswa';
import axios from 'axios';
import ListKelas from '@/component/ListKelas';
import ListLookup from '@/component/ListLookup';
import ListUAS from '@/component/ListUAS';
import { useRouter } from 'next/router';
import {getCookie} from "cookies-next"

export default function uas() {

    //session or user area
    const route = useRouter()
    const [isUserLog, setIsUserLog] = useState(false)
    const [userData, setUserData] = useState({})

    useEffect(()=>{
        const us = getCookie('dataUser')
        if(us == undefined){
            route.push('/')
        }else{
            const userSession = JSON.parse(us)
            if(userSession.data[0].nama_lengkap == 'ADMIN'){
                setUserData(userSession.data[0])
                setIsUserLog(true)
            }else{
                route.push('/')
                setTimeout(()=>{alert('Anda BUKAN Admin')}, 2500)
            }
        }
    },[])

  // state menu admin
    const [isSiswa, setIsSiswa] = useState(false);
    const [isLookup, setisLookup] = useState(false);
    const [isKelas, setisKelas] = useState(false);
    const [isEvent, setIsEvent] = useState(false);
    const [initial, setInitial] = useState(true);

    //hanlde Menu Admin
    const handleMenu = (act)=>{
        switch(act)
        {
            case "isSiswa":
                setIsSiswa(true);
                setisLookup(false);
                setisKelas(false);
                setIsEvent(false);
                setInitial(false);
                break;
            case "isLookup":
                setIsSiswa(false);
                setisLookup(true);
                setisKelas(false);
                setIsEvent(false);
                setInitial(false);
                break;
            case "isKelas":
                setIsSiswa(false);
                setisLookup(false);
                setisKelas(true);
                setIsEvent(false);
                setInitial(false);
                break;
            case "isEvent":
                setIsSiswa(false);
                setisLookup(false);
                setisKelas(false);
                setIsEvent(true);
                setInitial(false);
                break;
            default:
                setIsSiswa(false);
                setisLookup(false);
                setisKelas(false);
                setIsEvent(false);
                setInitial(true);
                break;
        }
    }

    //handle Data View
    const [dataKelas, setDataKelas] = useState([])
    const handleDataSiswa = async()=>{
      await axios.get("/api/get/datakelas").then((e)=>{
        setDataKelas(e.data.data_kelas)
        handleMenu("isSiswa")
      })
    }

    //handle data siswa area
    const [selectedKelas, setSelectedKelas] = useState(["Pilih kelas"]);
    const [dataSiswaTabel, setDataSiswaTabel] = useState([])
    const [isDataSiswaTable, setIsDataSiswaTabel] = useState(false)
    const selectedKelasValue = useMemo(
        () => Array.from(selectedKelas).join(", ").replaceAll("_", " "),
        [selectedKelas]
    );

    const handleDataPerkelas = async()=>{
      const dataQuery = {
        value : selectedKelasValue
      }
        await axios.post("/api/get/datasiswa", dataQuery)
        .then((e)=>{
          setDataSiswaTabel(e.data)
          if(isDataSiswaTable == false){
              setIsDataSiswaTabel(true)
          }
        })
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

    //hanlde Data Link Area
    const [dataLinkView, setDataLinkView] = useState([])
    const handleDataLink = async()=>{
        await axios.post('/api/get/datalink', {tahun : "2022/2023", semester : "GENAP", event : "UAS", kode_akses : userData.kode_akses.trim()})
        .then((e)=>{
            setDataLinkView(e.data)
            if(isEvent == false) handleMenu("isEvent")
        })
    }


  return (
    <>       
        <main className='min-w-full min-h-screen bg-slate-100 text-black' >
            {(isUserLog) ? (
                <>
                <div className="w-full h-[60px] max-w-[1180px] flex justify-between items-center mx-auto border-b-2 border-gray-700">
                    <div className="w-[120px]">
                        <h2 className="text-xl font-medium">Jaya Buana</h2>
                    </div>
                    <div className="flex gap-2 w-fit">
                        <Navigation />
                    </div>
                </div>
                <div className="container relative min-h-screen flex flex-col items-center gap-5 max-w-[1180px] mx-auto bg-slate-100 mt-5">
                    {(initial) && (
                    <div>
                        <h1 className="text-2xl">Selamat Datang Admin, Have a nice day !</h1>
                    </div>
                    )}
                    <div className="w-full h-screen flex flex-col gap-4">
                        <div className="text-black w-full h-fit p-3 flex flex-col gap-4">
                            <h2 className="text-center font-medium text-xl">Pilih Data </h2>
                            <div className="flex flex-wrap gap-3 justify-center items-center text-white">
                                <button className="p-4 w-[175px] h-[40px] bg-sky-600 rounded-md flex justify-center items-center" onClick={handleDataLookup}>
                                    <h2> Lookup</h2>
                                </button>
                                <button className="p-4 w-[175px] h-[40px] bg-sky-600 rounded-md flex justify-center items-center" onClick={handleDataSiswa}>
                                    <h2>Data Siswa</h2>
                                </button>
                                <button className="p-4 w-[175px] h-[40px] bg-sky-600 rounded-md flex justify-center items-center" onClick={handleDataKelas}>
                                    <h2>Kelas</h2>
                                </button>
                                <button className="p-4 w-[175px] h-[40px] bg-sky-600 rounded-md flex justify-center items-center" onClick={handleDataLink}>
                                    <h2>Link UAS</h2>
                                </button>
                            </div>
                        </div>
                        <div className="text-black bg-slate-200 w-full h-fit shadow-md rounded-md p-3 ">
                            {(isSiswa) && (
                                <>
                                <div className='flex flex-row justify-center items-center gap-4' >
                                    <div className="flex flex-row gap-2 justify-center items-center">
                                        <p>Kelas</p>
                                        <Dropdown>
                                            <Dropdown.Button color="primary" ghost css={{ tt: "capitalize" }}>
                                                {selectedKelas}
                                            </Dropdown.Button>
                                            <Dropdown.Menu
                                                aria-label="Single selection actions"
                                                color="primary"
                                                disallowEmptySelection
                                                selectionMode="single"
                                                selectedKeys={selectedKelas}
                                                onSelectionChange={setSelectedKelas}
                                                items={dataKelas}
                                            >
                                                {(i)=>(
                                                    <Dropdown.Item key={i.nama_kelas}>
                                                        {i.nama_kelas}
                                                    </Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <div>
                                    <Button type="submit" color="primary" onPress={handleDataPerkelas} auto>
                                    Tampilkan
                                    </Button>
                                    </div>
                                </div>
                                {(isDataSiswaTable) && (
                                    <div className='flex flex-col items-center mt-5'>
                                        <div>
                                            <p className='font-semibold'>DATA SISWA</p>
                                        </div>
                                        <div className='w-full'>
                                            <ListSiswa dataSiswa={dataSiswaTabel} />
                                        </div>
                                    </div>                                    
                                )}
                                </>
                            )}

                            {(isKelas) && (
                                <div className='flex flex-col items-center'>
                                    <div>
                                        <p className='font-semibold'>DATA KELAS</p>
                                    </div>
                                    <div className='w-full'>
                                        <ListKelas dataKelas={dataKelasView}  />
                                    </div>
                                </div>
                            )}

                            {(isLookup) && (
                                <div className='flex flex-col items-center'>
                                    <div>
                                        <p className='font-semibold'>DATA LOOKUP</p>
                                    </div>
                                    <div className='w-full'>
                                        <ListLookup dataLookup={dataLookupView} />
                                    </div>
                                </div>
                            )}

                            {(isEvent) && (
                                <div className='flex flex-col items-center'>
                                    <div>
                                        <p className='font-semibold'>DAFTAR LINK UAS</p>
                                    </div>
                                    <div className='w-full'>
                                        <ListUAS dataLink={dataLinkView} />
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
                    <p className="text-4xl font-bold">Page Not Allowed</p>
                    <p className="text-base">
                        Mohon Login dahulu
                    </p>                    
                </div>
            )}
        </main>
        </>
  )
}
