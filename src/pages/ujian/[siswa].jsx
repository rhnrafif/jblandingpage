import Link from "next/link"
import { getCookie, deleteCookie } from "cookies-next"
import axios from "axios";
import {useRouter} from "next/router"
import { useEffect, useState, useContext } from "react"
import { Button, Modal, Loading } from "@nextui-org/react";
import { LoadingState } from "@/component/GlobalState/IsLoadingProvider";
import Image from "next/image";

export default function HelloScreen({data}) {
  
    //session or user area
    const route = useRouter()
    const [isUserLog, setIsUserLog] = useState(false)
    const [userData, setUserData] = useState({})
    const [userLink, setUserLink] = useState({})
    const [isError, setIsError] = useState(false)


    //global state
    const [isLoading, setIsLoading] = useContext(LoadingState)

    useEffect(() => {
      const us = getCookie('dataUser')
      if (us === undefined) {
        route.push('/')
        return
      }

      const userSession = JSON.parse(us)
      if (userSession.data[0].nama_lengkap === 'ADMIN') {
        route.push('/')
        return
      }

      const kode = userSession.data[0].kode_akses.trim()
      axios.post(`/api/get/datauser`, { kode })
        .then((res) => {
          const { dataLinkUas, datauser } = res.data
          setUserLink(dataLinkUas)
          setUserData(datauser)
          setIsLoading(false)
          setIsUserLog(true)
        })
        .catch((error) => {
          alert("Action Failed, Please try again");
        })
    }, [])


    const handleLogout = ()=>{
    deleteCookie('dataUser')
    alert('Anda Berhasil Log out')
    route.push('/')
  }

  return (
    <>      
        <main className='min-w-full min-h-screen bg-slate-100 text-black px-2 relative' >
          <>
          {(isLoading == false) ? (
            <>    
              {(isError) ? (
                <div className="w-full min-h-screen flex flex-col justify-center items-center gap-3">
                    <Image src={'/notall.svg'} width={400} height={400} alt="page not allowed" />
                    <p className="text-2xl">
                        Mohon <a href="/" className="text-sky-600 font-semibold">Login</a> dahulu
                    </p>                    
                </div>
              ) : (
                <>
                  {(isUserLog) ? (
                <>
                    <div className="w-full h-fit max-w-[980px] flex justify-between items-center mx-auto lg:border-b-2 lg:border-gray-700 pt-4 md:pb-3">
                        <div className="w-full flex justify-center">
                          <Image src={'/logo.svg'} width={100} height={100} alt="logo" />
                        </div>
                    </div>
                    <div className="absolute top-3 right-2">
                      <Button
                        size={"sm"}
                        auto
                        onClick={handleLogout}
                        >
                          Log out
                        </Button>
                    </div>
                  <div className="container w-full relative min-h-screen flex gap-5 max-w-[1180px] mx-auto bg-slate-100 mt-3 px-2 ">
                        <div className=" w-full flex flex-col items-center mx-auto gap-4 md:gap-10">
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex flex-col items-center">
                                <h1 className="text-base md:text-xl">PENILAIAN AKHIR TAHUN</h1>
                                <h1 className="text-base md:text-xl">SEMESTER GENAP</h1>
                                <h1 className="text-base md:text-xl">TAHUN PELAJARAN 2022/2023</h1>
                              </div>
                              <h1 className="text-base md:text-lg">Selamat Datang, <span className="font-semibold">{userData[0].nama_lengkap}</span></h1>
                              <h1 className="text-base md:text-lg">Pastikan Data Diri kamu benar ya !</h1>
                            </div>
                            <div className="w-full flex flex-col items-center gap-5">
                              <div className="w-[75%] text-black bg-slate-200 mx-auto h-fit shadow-md rounded-md py-3 px-2 md:w-[380px] ">
                                  <div className="flex flex-col items-start gap-3 w-full h-full">
                                      <div className=' w-full flex flex-row justify-start items-center gap-2'>
                                          <p className="w-[25%]">Nama </p>
                                          <p className="w-[75%]">: <span className="font-semibold">{userData[0].nama_lengkap}</span></p>
                                      </div>
                                      <div className='w-full flex flex-row justify-start items-center gap-2'>
                                          <p className="w-[25%]">Kelas </p>
                                          <p className="w-[75%]">: <span className="font-semibold">{userData[0].nama_kelas}</span></p>
                                      </div>
                                  </div>
                              </div>
                              <div className="w-[60%] flex flex-col items-center gap-3">
                                {(userLink.length != 0) ? (
                                  <>
                                      <h2>Pilih Mata Pelajaran</h2>
                                      <div className="w-full max-w-[480px] flex flex-wrap gap-2 justify-center">
                                        {userLink?.map((e)=>{
                                          return(
                                            <Link href={e.link_ujian} target="_blank" className="w-fit h-[40px] px-2 bg-sky-700 text-white rounded text-base flex justify-center items-center" key={e.id}>
                                              {e.mata_pelajaran}
                                            </Link>
                                          )
                                        })}
                                      </div>
                                  </>
                                ) : (
                                  <>
                                      <h2>Link Ujian tidak tersedia</h2>
                                  </>
                                )}
                                
                              </div>
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
          
          </>
          
        </main>
        </>
  )
}

export async function getServerSideProps({req, res}){

  return{
    props : {
    }
  }
}
