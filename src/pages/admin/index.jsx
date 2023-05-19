import Link from "next/link"
import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import InputSiswa from "@/component/InputSiswa"
import InputUAS from "@/component/InputUAS"
import Navigation from "@/component/Navigation"
import {getCookie} from "cookies-next"
import { useRouter } from "next/router"
import { SiswaInput } from "@/component/GlobalState/SiswaInputProvider"
import { DisplaySiswa } from "@/component/GlobalState/DisplaySiswaProvider"
import {Modal, Loading, Button} from "@nextui-org/react"
import ListSiswaInput from "@/component/ListSiswaInput"
import { LoadingState } from "@/component/GlobalState/IsLoadingProvider"
import ImportExcelSiswa from "@/component/ImportExcelSiswa"
import Image from "next/image"

export default function Index({data}){
    
    //session or user area
    const route = useRouter()
    const [isUserLog, setIsUserLog] = useState(false)
    const [userData, setUserData] = useState({})

    //global state
    const [dataSiswaInput, setDataSiswaInput] = useContext(SiswaInput);
    const [isInputSiswa, setIsInputSiswa] = useContext(DisplaySiswa);
    const [isLoading, setIsLoading] = useContext(LoadingState)

    // state menu admin
    const [isSiswa, setIsSiswa] = useState(false);
    const [isEvent, setIsEvent] = useState(false);
    const [initial, setInitial] = useState(true);
    const [isImport, setIsImport] = useState(false);

    const [navLink, setNavLink] = useState({});

    useEffect(() => {
        setIsInputSiswa(false);
        const us = getCookie('dataUser');
        if (us === undefined) {
            route.push('/');
            return;
        }

        const userSession = JSON.parse(us);
        if (userSession.data[0].nama_lengkap === 'ADMIN') {
            setUserData(userSession);
            setNavLink({input : '/admin', view : '/admin/view'})
            setIsLoading(false);
            setIsUserLog(true);
        } else {
            route.push('/');
            setTimeout(() => {
            alert('Anda BUKAN Admin, silahkan log in kembali');
            }, 2500);
        }
    }, []);


    //hanlde Menu Admin
    const handleMenu = (act)=>{
        switch(act)
        {
            case "isSiswa":
                setIsSiswa(true);
                setIsEvent(false);
                setInitial(false);
                break;
            case "isEvent":
                setIsSiswa(false);
                setIsEvent(true);
                setInitial(false);
                setIsInputSiswa(false);
                break;
            default:
                setIsSiswa(false);
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
        <main className='min-w-full min-h-screen bg-slate-100 text-black px-3 md:px-0 ' >
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
                    <div className="container relative min-h-screen flex flex-col items-center gap-5 max-w-[1180px] mx-auto bg-slate-100 mt-5">
                        {(initial) && (
                            <div>
                                <h1 className=" text-lg md:text-2xl">Selamat Datang {userData.data[0].nama_lengkap}, Have a nice day !</h1>
                            </div>
                        )}                    
                            <div className="w-full h-full flex flex-col md:flex-row gap-4">
                                <div className="text-black bg-slate-200 w-full md:w-[40%] h-[280px] shadow-md rounded-md p-3 flex flex-col gap-4">
                                    <h2 className="text-center font-medium text-xl">Pilih Menu Admin </h2>
                                    <div className="flex flex-wrap gap-3 justify-center text-white">
                                        <button className="p-4 w-[175px] h-[80px] bg-sky-600 rounded-md" onClick={handleDataJurusan}>
                                            <h2>Input Data Siswa</h2>
                                        </button>
                                        <button className="p-4 w-[175px] h-[80px] bg-sky-600 rounded-md" onClick={()=>{handleMenu("isEvent")}}>
                                            <h2>Input Link UAS</h2>
                                        </button>
                                    </div>
                                </div>
                                <div className=" bg-slate-200 w-full md:w-[60%] min-h-[280px] shadow-md rounded-md p-3 flex justify-center items-center relative">
                                    {(isSiswa) && (
                                        <>
                                        <div className='absolute top-3 right-2'>
                                            <Button size={'sm'} auto onPress={()=>{setIsImport(!isImport)}} className='absolute'>
                                            Import Excel
                                            </Button>
                                        </div>
                                            {(isImport) ? (
                                                <ImportExcelSiswa />
                                            ) : (
                                                <InputSiswa dataSiswa={dataJurusan} />
                                            )}
                                        </>
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
  const protocol = req.headers["x-forwarded-proto"] || "http"; // Use the X-Forwarded-Proto header if available, or default to http
  const host = req.headers.host;
  const baseURL = `${protocol}://${host}`;

  const [dataMapel, dataJurusan] = await Promise.all([
    axios.get(`${baseURL}/api/get/datamapel`),
    axios.get(`${baseURL}/api/get/datajurusan`),
  ]);

  const resultData = {
    dataMapel: dataMapel.data,
    dataJurusan: dataJurusan.data,
  };

  return {
    props: {
      data: resultData,
    },
  };
}
