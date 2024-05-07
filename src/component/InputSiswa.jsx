import React, { useContext } from 'react'
import {Dropdown, Input, Modal, Button, Text, Table, Loading} from "@nextui-org/react"
import {useForm} from "react-hook-form"
import {useState, useMemo} from "react"
import axios from 'axios'
import { useRouter } from 'next/router'
import { SiswaInput } from './GlobalState/SiswaInputProvider';
import { DisplaySiswa } from './GlobalState/DisplaySiswaProvider';
import generateString from './Helper/generateString'

import {read, utils, writeFile} from 'xlsx'

export default function InputSiswa({dataSiswa}) {
  
    
    //global state
    const [dataSiswaInput, setDataSiswaInput] = useContext(SiswaInput);
    const [isInputSiswa, setIsInputSiswa] = useContext(DisplaySiswa);

    //cek data realtime
    const [classname, setClassname] = useState('');
    const [isRefresh, setIsRefresh] = useState(false);

    const [isLoad, setIsLoad] = useState(false)

    const {handleSubmit, register, watch, formState:{errors}} = useForm();

    const route = useRouter();
    
    //set modal
    const [isModal, setIsModal] = useState(false);
    const handleModal = ()=>{
      setIsModal(!isModal)
      document.getElementById('inputSiswa').value = ""
      route.push('/admin')
    }

    //item dropdown jurusan
    const [selectedJurusan, setSelectedJurusan] = useState(["Pilih Jurusan"])
    const selectedJurusanValue = useMemo(
        () => Array.from(selectedJurusan).join(", ").replaceAll("_", " "),
        [selectedJurusan]
    )

    //item dropdown kelas
    const [dataKelas, setDataKelas] = useState([])
    const [selectedKelas, setSelectedKelas] = useState(["Pilih kelas"]);
    const selectedKelasValue = useMemo(
        () => Array.from(selectedKelas).join(", ").replaceAll("_", " "),
        [selectedKelas]
    );

    const handleDataKelas = async(jurusan)=>{
        await axios.post("/api/get/datakelas", {jurusan : jurusan}).then((e)=>{
        setDataKelas(e.data.data_kelas)
      }).catch((err)=>{alert('Mohon Coba Lagi')})
    }


    //hanlde display data siswa sblm di add
    const handleDisplay = async(i)=>{
      const dataQuery = {
        value : i
      }
        await axios.post("/api/get/datasiswa", dataQuery)
        .then((e)=>{
          setDataSiswaInput(e.data)
          setIsInputSiswa(true)
        }).catch((error)=>{
            alert('Gagal memuat data, silahkan coba lagi')
        })
    }


  const submitTest = async(e)=>{

    setIsLoad(true);
    if(e.nama_lengkap == " "){
      setIsLoad(false);
      alert('Nama Lengkap tidak boleh kosong')
      return
    }
    if(selectedKelasValue == "Pilih kelas"){
      setIsLoad(false);
      alert('Kelas harus dipilih')
      return
    } 

    const dataInput = {
        nama_lengkap : e.nama_lengkap.toUpperCase(),
        nama_kelas : selectedKelasValue,
        kode_akses : generateString(6)
    }

    //area hit API
     try {
        await axios.post(`/api/add/datasiswa`, dataInput)
        .then((e)=>{
          if(e.status == 201){
            setIsLoad(false);
            setIsModal(!isModal);
            setClassname(e.data.nama_kelas);
            setIsRefresh(true)
          }
        })
        .catch((err)=>{
          setIsLoad(false)
          alert(`Terjadi kesalahan, ${err.response.data.message}`)
        })
    } catch (error) {setIsLoad(false);alert('Action Failed, Please try again');}
  }

  return (
    <div className="flex flex-col gap-4 items-center">
        <p className="text-lg font-semibold">Input data Siswa</p>
        <form action="" className="flex flex-col gap-3 items-center" onSubmit={handleSubmit(submitTest)}>
            <div className='flex flex-col'>
                  <div className="flex flex-wrap justify-center sm:flex-row gap-2 items-center sm:justify-between w-full">

                        <Input clearable label="Nama Lengkap" name="nama_lengkap" width="240px" id='inputSiswa'
                        {... register("nama_lengkap", {
                          required : {
                            value : true,
                            message : "Nama wajib diisi"
                          }
                        })}
                        />

                      <div className="flex flex-col gap-2 items-center">
                          <p>Jurusan</p>
                          <Dropdown
                          >
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
                                  items={dataSiswa}
                                  onAction={(i)=>{handleDataKelas(i)}}
                              >
                                  {(i)=>(
                                      <Dropdown.Item className='text-sm sm:text-base' key={i.value}>
                                          {i.value}
                                      </Dropdown.Item>
                                  )}
                              </Dropdown.Menu>
                          </Dropdown>
                      </div>

                      <div className="flex flex-col gap-2 items-center">
                          <p>Kelas</p>
                          <Dropdown
                          >
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
                                  onAction={(i)=>{handleDisplay(i)}}
                                  items={dataKelas}
                              >
                                  {(i)=>(
                                      <Dropdown.Item className='text-sm sm:text-base' key={i.nama_kelas}>
                                          {i.nama_kelas}
                                      </Dropdown.Item>
                                  )}
                              </Dropdown.Menu>
                          </Dropdown>
                      </div>
                  </div>
                  <div className='flex gap-1 flex-col'>
                    {errors?.nama_lengkap && <small style={{color : 'red'}}>{ errors?.nama_lengkap.message}</small>}
                  </div>
            </div>
            
            <div className='mt-4'>
                <Button type="submit" auto color={'primary'} >
                Submit
                </Button>
            </div>
        </form>

        {(isRefresh) && (
          <>
            <div className='w-fit ml-auto'>
                <Button type="submit" flat size="sm"  color="primary" auto onClick={()=>{handleDisplay(classname)}}>
                  Cek Data
                </Button>
            </div>
          </>
        )}

        {(isLoad) && (
        <Modal 
        width='120px'
        aria-labelledby="modal-title"
        open={isLoad}
        >
            <Modal.Body>
                <Loading type='points' />
            </Modal.Body>
        </Modal>
      )}

        <Modal
      closeButton
      open={isModal}
      >
        <Modal.Header>
          <Text size={18}>Berhasil Input Data</Text>
        </Modal.Header>
        <Modal.Footer
        justify='center'
        >
          <Button auto onPress={handleModal}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
