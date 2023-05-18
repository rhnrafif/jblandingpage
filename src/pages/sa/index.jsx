import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import InputKelas from "@/component/InputKelas"
import InputLookup from "@/component/InputLookup"
import Navigation from "@/component/Navigation"
import {getCookie} from "cookies-next"
import { useRouter } from "next/router"
import { SiswaInput } from "@/component/GlobalState/SiswaInputProvider"
import { DisplaySiswa } from "@/component/GlobalState/DisplaySiswaProvider"
import {Modal, Loading, Button} from "@nextui-org/react"
import { LoadingState } from "@/component/GlobalState/IsLoadingProvider"
import ImportExcelLookup from "@/component/ImportExcelLookup"
import ImportExcelKelas from "@/component/ImportExcelKelas"

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
    const [isLookup, setisLookup] = useState(false);
    const [isKelas, setisKelas] = useState(false);
    const [initial, setInitial] = useState(true);

    const [navLink, setNavLink] = useState({});
    const [isImportLookup, setIsImportLookup] = useState(false);
    const [isImportKelas, setIsImportKelas] = useState(false);

    useEffect(() => {
        const us = getCookie('dataUser');
        if (us === undefined) {
            route.push('/');
            return;
        }

        const userSession = JSON.parse(us);
        if (userSession.data[0].nama_lengkap === 'SA') {
            setUserData(userSession);
            setNavLink({input : '/sa', view : '/sa/view'})
            setIsLoading(false);
            setIsUserLog(true);
        } else {
            route.push('/');
            setTimeout(() => {
            alert('Anda BUKAN Super Admin, silahkan log in kembali');
            }, 2500);
        }
    }, []);


    //hanlde Menu Admin
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

    return(
        <>       
        <main className='min-w-full min-h-screen bg-slate-100 text-black ' >
            {(isLoading == false) ? (
                <>
                    {(isUserLog) ? (
                        <>
                        <div className="w-full h-[60px] max-w-[1180px] flex justify-between items-center mx-auto border-b-2 border-gray-700">
                            <div className="w-[120px]">
                                <h2 className="text-xl font-medium">Jaya Buana</h2>
                            </div>
                            <div className="flex gap-2 w-fit">
                                <Navigation link={navLink} />
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
                                        <button className="p-4 w-[175px] h-[80px] bg-sky-600 rounded-md" onClick={()=>{handleMenu("isKelas")}}>
                                            <h2>Input Kelas</h2>
                                        </button>
                                    </div>
                                </div>
                                <div className=" bg-slate-200 w-[60%] min-h-[280px] shadow-md rounded-md p-3 flex justify-center items-center relative">
                                    
                                    {(isKelas) && (
                                        <>
                                        <div className='absolute top-3 right-2'>
                                            <Button size={'sm'} auto onPress={()=>{setIsImportKelas(!isImportKelas)}} className='absolute'>
                                            Import Excel
                                            </Button>
                                        </div>
                                            {(isImportKelas) ? (
                                                <ImportExcelKelas />
                                            ) : (
                                                <InputKelas dataJurusan={data.dataJurusan} />
                                            )}
                                        </>
                                    )}
        
                                    {(isLookup) && (
                                        <>
                                        <div className='absolute top-3 right-2'>
                                            <Button size={'sm'} auto onPress={()=>{setIsImportLookup(!isImportLookup)}} className='absolute'>
                                            Import Excel
                                            </Button>
                                        </div>
                                            {(isImportLookup) ? (
                                                <ImportExcelLookup />
                                            ) : (
                                                <InputLookup />
                                            )}
                                        </>
                                    )}
        
                                    {(initial) && (
                                        <div className="w-fit h-fit my-auto justify-center items-center">
                                            <h2 className="text-center">Welcome to JayaBuana </h2>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        </>
                    ) : (
                        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-3">
                            <img src={`${process.env.NEXT_PUBLIC_URL_NOT_ALLOWED}`} alt="page not allowed" 
                            className="max-w-md"
                            />
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

  const [ dataJurusan] = await Promise.all([
    axios.get(`${baseURL}/api/get/datajurusan`),
  ]);

  const resultData = {
    dataJurusan: dataJurusan.data,
  };

  return {
    props: {
      data: resultData,
    },
  };
}
