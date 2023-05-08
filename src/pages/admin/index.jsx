import Link from "next/link"
import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import InputSiswa from "@/component/InputSiswa"
import InputKelas from "@/component/inputKelas"
import InputLookup from "@/component/InputLookup"
import InputUAS from "@/component/InputUAS"
import Navigation from "@/component/Navigation"
import {getCookie, getCookies, setCookie, removeCookie} from "cookies-next"
import { useRouter } from "next/router"
import { SiswaInput } from "@/component/GlobalState/SiswaInputProvider"
import { DisplaySiswa } from "@/component/GlobalState/DisplaySiswaProvider"
import ListUAS from "@/component/ListUAS"
import ListSiswaInput from "@/component/ListSiswaInput"

const env = process.env

export default function Index({data}){
    
    //session or user area
    const route = useRouter()
    const [isUserLog, setIsUserLog] = useState(false)
    const [userData, setUserData] = useState({})

    //global state
    const [dataSiswaInput, setDataSiswaInput] = useContext(SiswaInput);
    const [isInputSiswa, setIsInputSiswa] = useContext(DisplaySiswa)

    // state menu admin
    const [isSiswa, setIsSiswa] = useState(false);
    const [isLookup, setisLookup] = useState(false);
    const [isKelas, setisKelas] = useState(false);
    const [isEvent, setIsEvent] = useState(false);
    const [initial, setInitial] = useState(true);

    useEffect(()=>{
        const us = getCookie('dataUser')
        if(us == undefined){
            route.push('/')
        }else{
            const userSession = JSON.parse(us)
            if(userSession.data[0].nama_lengkap == 'ADMIN'){
                setUserData(userSession)
                setIsUserLog(true)
            }else{
                route.push('/')
                setTimeout(()=>{alert('Anda BUKAN Admin, silahkan log in kembali')}, 2500)
            }
        }
    },[])

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
                setIsInputSiswa(false);
                break;
            case "isKelas":
                setIsSiswa(false);
                setisLookup(false);
                setisKelas(true);
                setIsEvent(false);
                setInitial(false);
                setIsInputSiswa(false);
                break;
            case "isEvent":
                setIsSiswa(false);
                setisLookup(false);
                setisKelas(false);
                setIsEvent(true);
                setInitial(false);
                setIsInputSiswa(false);
                break;
            default:
                setIsSiswa(false);
                setisLookup(false);
                setisKelas(false);
                setIsEvent(false);
                setInitial(true);
                setIsInputSiswa(false);
                break;
        }
    }

    //handle data jurusan utk input siswa
    const [dataJurusan, setDataJurusan] = useState([])
    const handleDataJurusan = async()=>{
        await axios.get("/api/get/datajurusan").then((e)=>{
            setDataJurusan(e.data)
            handleMenu("isSiswa")
        }).catch((err)=>{alert('Mohon Coba Lagi')})
    }

    return(
        <>       
        <main className='min-w-full min-h-screen bg-slate-100 text-black ' >
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
                        <h1 className="text-2xl">Selamat Datang {userData.data[0].nama_lengkap}, Have a nice day !</h1>
                    </div>
                )}                    
                    <div className="w-full h-full flex gap-4">
                        <div className="text-black bg-slate-200 w-[40%] h-[280px] shadow-md rounded-md p-3 flex flex-col gap-4">
                            <h2 className="text-center font-medium text-xl">Pilih Menu Admin </h2>
                            <div className="flex flex-wrap gap-3 justify-center text-white">
                                <button className="p-4 w-[175px] h-[80px] bg-sky-600 rounded-md" onClick={()=>{handleMenu("isLookup")}}>
                                    <h2>Input Lookup</h2>
                                </button>
                                <button className="p-4 w-[175px] h-[80px] bg-sky-600 rounded-md" onClick={handleDataJurusan}>
                                    <h2>Input Data Siswa</h2>
                                </button>
                                <button className="p-4 w-[175px] h-[80px] bg-sky-600 rounded-md" onClick={()=>{handleMenu("isKelas")}}>
                                    <h2>Input Kelas</h2>
                                </button>
                                <button className="p-4 w-[175px] h-[80px] bg-sky-600 rounded-md" onClick={()=>{handleMenu("isEvent")}}>
                                    <h2>Input Link UAS</h2>
                                </button>
                            </div>
                        </div>
                        <div className=" bg-slate-200 w-[60%] min-h-[280px] shadow-md rounded-md p-3 flex justify-center items-center">
                            {(isSiswa) && (
                                <InputSiswa dataSiswa={dataJurusan} />
                            )}

                            {(isKelas) && (
                                <InputKelas dataJurusan={data.dataJurusan} />
                            )}

                            {(isLookup) && (
                                <InputLookup />
                            )}

                            {(isEvent) && (
                                <InputUAS dataEvent={data} />
                            )}

                            {(initial) && (
                                <div className="w-fit h-fit my-auto justify-center items-center">
                                    <h2 className="text-center">Welcome to JayaBuana </h2>
                                </div>
                            )}
                        </div>
                    </div>
                    {(isInputSiswa) && (
                        <div className="w-full max-w-[59%] ml-auto">
                            <ListSiswaInput dataSiswa={dataSiswaInput} />
                        </div>
                    )}
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

export async function getServerSideProps({req, res}){

    // const res = await prisma.data_siswa.findFirst({
    //     where : {
    //         kode_akses : ` ${ctx.query.uid}`
    //     }
    // });

    const dataKelas = await axios.get(`${env.WEBURL}/api/get/datakelas`);
    const dataMapel = await axios.get(`${env.WEBURL}/api/get/datamapel`);
    const dataEvent = await axios.get(`${env.WEBURL}/api/get/dataevent`);
    const dataJurusan = await axios.get(`${env.WEBURL}/api/get/datajurusan`);    

    const resultData = {
        dataKelas : dataKelas.data,
        dataMapel : dataMapel.data,
        dataEvent : dataEvent.data,
        dataJurusan : dataJurusan.data
    }

    // const user = getCookie('dataUser', { req, res })
    // console.info(user == undefined)
    // setCookie('dataUser', resultData, { req, res, maxAge: 60 * 6 * 24 })
    // let dataCookie = JSON.parse(getCookie('dataUser', { req, res })) 
    // let dataFromCookie = cookie.parse(ctx.req.headers.cookie);
    // let dataQuery = ctx.query; 
    
    
    return{
        props :{
            data : resultData
        }
    }
}