import React, { useContext } from 'react'
import Navigation from '@/component/Navigation'
import {useState, useMemo, useEffect} from "react"
import {  Dropdown, Button, Modal, Loading } from "@nextui-org/react";
import ListSiswa from '@/component/ListSiswa';
import axios from 'axios';
import ListUAS from '@/component/ListUAS';
import { useRouter } from 'next/router';
import {getCookie} from "cookies-next"
import { LoadingState } from '@/component/GlobalState/IsLoadingProvider';


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
        if (data[0].nama_lengkap === 'ADMIN') {
            setUserData(data[0]);
            setNavLink({input : '/admin', view : '/admin/view'})
            setIsLoading(false);
            setIsUserLog(true);
        } else {
            route.push('/');
            setTimeout(() => {
            alert('Anda BUKAN Admin');
            }, 2500);
        }
    }, []);


  // state menu admin
    const [isSiswa, setIsSiswa] = useState(false);
    const [isEvent, setIsEvent] = useState(false);
    const [initial, setInitial] = useState(true);

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
                break;
            default:
                setIsSiswa(false);
                setIsEvent(false);
                setInitial(true);
                break;
        }
    }

    
    //handle Data Siswa Area
    const [dataJurusan, setDataJurusan] = useState([])
    const handleDataJurusan = async()=>{
        await axios.get("/api/get/datajurusan").then((e)=>{
            setDataJurusan(e.data)
            handleMenu("isSiswa")
        }).catch((err)=>{alert('Mohon Coba Lagi')})
    }

    const [selectedJurusan, setSelectedJurusan] = useState(["Pilih Jurusan"])
    const selectedJurusanValue = useMemo(
        () => Array.from(selectedJurusan).join(", ").replaceAll("_", " "),
        [selectedJurusan]
    )

    const [dataSiswaTabel, setDataSiswaTabel] = useState([])
    const [isDataSiswaTable, setIsDataSiswaTabel] = useState(false)
    const [dataKelas, setDataKelas] = useState([])
    const handleDataSiswa = async(jurusan)=>{
      await axios.post("/api/get/datakelas", {jurusan : jurusan}).then((e)=>{
        setDataKelas(e.data.data_kelas)
      }).catch((err)=>{alert('Mohon Coba Lagi')})
    }

    const [selectedKelas, setSelectedKelas] = useState(["Pilih kelas"]);
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
        }).catch((error)=>{
            alert('Gagal memuat data, silahkan coba lagi')
        })
    }

    //hanlde Data Link Area

    const [isLinkTable, setIsLinkTable] = useState(false)
    const [Jurusan, setJurusan] = useState([])
    const handleJurusanLink = async()=>{
        await axios.get("/api/get/datajurusan").then((e)=>{
            setJurusan(e.data)
            handleMenu("isEvent")
        }).catch((err)=>{alert('Mohon Coba Lagi')})
    }

    const [selJurusan, setSelJurusan] = useState(["Pilih Jurusan"])
    const selJurusanValue = useMemo(
        () => Array.from(selJurusan).join(", ").replaceAll("_", " "),
        [selJurusan]
    )

    const [dataLinkView, setDataLinkView] = useState([])
    const handleDataLink = async(i)=>{

        const dataQuery = {
            tahun : (data.dataEvents == null) ? '' : data.dataEvents.tahun_ajaran, 
            semester : (data.dataEvents == null) ? '' : data.dataEvents.semester, 
            event : (data.dataEvents == null) ? '' : data.dataEvents.nama_event, 
            kode_akses : userData.kode_akses.trim(),
            jurusan : i
        }

        await axios.post('/api/get/datalink', dataQuery )
        .then((e)=>{
            if(e.data.dataLink != null){
                setDataLinkView(e.data)
                setIsLinkTable(true)
            }else alert('Event tidak terdaftar')
        })
        .catch((error)=>{
            alert('Data tidak ditemukan')
        })
    }


  return (
    <>       
        <main className='min-w-full min-h-screen bg-slate-100 text-black' >
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
                                <h1 className="text-2xl">Selamat Datang Admin, Have a nice day !</h1>
                            </div>
                            )}
                            <div className="w-full min-h-screen flex flex-col gap-4 mb-5">
                                <div className="text-black w-full h-fit p-3 flex flex-col gap-4">
                                    <h2 className="text-center font-medium text-xl">Pilih Data </h2>
                                    <div className="flex flex-wrap gap-3 justify-center items-center text-white">
                                        <button className="p-4 w-[175px] h-[40px] bg-sky-600 rounded-md flex justify-center items-center" onClick={handleDataJurusan}>
                                            <h2>Data Siswa</h2>
                                        </button>
                                        <button className="p-4 w-[175px] h-[40px] bg-sky-600 rounded-md flex justify-center items-center" onClick={handleJurusanLink}>
                                            <h2>Link UAS</h2>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-black bg-slate-200 w-[90%] mx-auto h-fit shadow-md rounded-md p-3 ">
                                    {(isSiswa) && (
                                        <>
                                        <div className='flex flex-row justify-center items-center gap-4' >
                                            <div className="flex flex-row gap-2 justify-center items-center">
                                                <p>Jurusan</p>
                                                <Dropdown>
                                                    <Dropdown.Button color="primary" ghost css={{ tt: "capitalize" }}>
                                                        {selectedJurusan}
                                                    </Dropdown.Button>
                                                    <Dropdown.Menu
                                                        aria-label="Single selection actions"
                                                        color="primary"
                                                        disallowEmptySelection
                                                        selectionMode="single"
                                                        selectedKeys={selectedJurusan}
                                                        onSelectionChange={setSelectedJurusan}
                                                        items={dataJurusan}
                                                        onAction={(i)=>{handleDataSiswa(i)}}
                                                    >
                                                        {(i)=>(
                                                            <Dropdown.Item key={i.value}>
                                                                {i.value}
                                                            </Dropdown.Item>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
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
                                            <div className='flex flex-col items-center mt-5 -mb-2'>
                                                <div className='flex flex-col justify-center items-center gap-1'>
                                                    <p className='font-semibold'>DATA SISWA</p>
                                                    <p>{dataSiswaTabel.nama_kelas}</p>
                                                </div>
                                                <div className='w-fit'>
                                                    <ListSiswa dataSiswa={dataSiswaTabel} />
                                                </div>
                                            </div>                                    
                                        )}
                                        </>
                                    )}
        
                                    {(isEvent) && (
                                        <>
                                            <div className="flex flex-row gap-2 justify-center items-center mr-auto mb-4">
                                                <p>Jurusan</p>
                                                <Dropdown>
                                                    <Dropdown.Button color="primary" ghost css={{ tt: "capitalize" }}>
                                                        {selJurusan}
                                                    </Dropdown.Button>
                                                    <Dropdown.Menu
                                                        aria-label="Single selection actions"
                                                        color="primary"
                                                        disallowEmptySelection
                                                        selectionMode="single"
                                                        selectedKeys={selJurusan}
                                                        onSelectionChange={setSelJurusan}
                                                        items={Jurusan}
                                                        onAction={(i)=>{handleDataLink(i)}}
                                                    >
                                                        {(i)=>(
                                                            <Dropdown.Item key={i.value}>
                                                                {i.value}
                                                            </Dropdown.Item>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                                
                                            <div className='flex flex-col items-center'>
                                                {(isLinkTable) && (
                                                    <>
                                                        <div className='w-full flex flex-col justify-center items-center gap-3'>
                                                            <div className='flex flex-col justify-center items-center'>
                                                                <p className='font-semibold'>DAFTAR LINK UAS</p>
                                                                <p className='font-semibold text-lg'>{selJurusan}</p>
                                                            </div>
                                                            <div className='w-fit'>
                                                                <ListUAS dataLink={dataLinkView} />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
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

  const dataEvents = await axios.get(`${baseURL}/api/get/dataevent`);

  const resultData = {
    dataEvents: dataEvents.data,
  };

  return {
    props: {
      data: resultData,
    },
  };
}
