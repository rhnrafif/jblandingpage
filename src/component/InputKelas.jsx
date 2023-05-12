import React from 'react'
import {Dropdown, Input, Button, Modal, Text, Loading} from "@nextui-org/react"
import {useForm} from "react-hook-form"
import {useState, useMemo} from "react"
import axios from 'axios';
import { useRouter } from 'next/router';
import { SiswaInput } from './GlobalState/SiswaInputProvider';

export default function InputKelas({dataJurusan}) {

  const {handleSubmit, register, watch, formState:{errors}} = useForm();
  const [isLoad, setIsLoad] = useState(false);

  const route = useRouter()

  //item dropdown
  const [selectedJurusan, setselectedJurusan] = useState(["Pilih kelas"]);
  const selectedJurusanValue = useMemo(
      () => Array.from(selectedJurusan).join(", ").replaceAll("_", " "),
      [selectedJurusan]
  );

  //set modal
    const [isModal, setIsModal] = useState(false);
    const handleModal = ()=>{
      setIsModal(!isModal)
      document.getElementById('nama_kelas').value = ""
      route.push('/admin')
    }

  const submitKelas = async(e)=>{

    setIsLoad(true);
    if(e.nama_kelas == " "){
      alert('Nama Kelas tidak boleh kosong');
      setIsLoad(false)
      return
    }
    if(selectedJurusanValue == "Pilih kelas"){
      alert('Kelas/Jurusan harus dipilih')
      setIsLoad(false)
      return
    }
    
    const dataInput = {
      nama_kelas : e.nama_kelas.toUpperCase(),
      jurusan : selectedJurusanValue
    }

    //area hit API
    try {
        await axios.post("/api/add/datakelas", dataInput)
        .then((e)=>{
          if(e.status == 201){
            setIsLoad(false)
            setIsModal(!isModal)
          }
        })
        .catch((err)=>{
          setIsLoad(false)
          alert(`Terjadi kesalahan, ${err.response.data.message}`)
        })
    } catch (error) {
        setIsLoad(false)
        alert('Action Failed, Please try again');
    }
  }
    

  return (
    <div className="flex flex-col gap-4 items-center">
        <p className="text-lg font-semibold">Tambah Daftar Kelas</p>
        <form action="" className="flex flex-col gap-3 items-center" onSubmit={handleSubmit(submitKelas)}>
          <div className='flex flex-row gap-2 items-start'>
            <div className="flex flex-col gap-2 items-center">
                <p>Kelas / Jurusan</p>
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
                        onSelectionChange={setselectedJurusan}
                        items={dataJurusan}
                    >
                        {(i)=>(
                            <Dropdown.Item key={i.value}>
                                {i.value}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <p>Nama Kelas</p>
              <Input clearable name="nama_kelas" width="240px" placeholder='11 TBSM 2' id='nama_kelas'
              
              {... register("nama_kelas", {
                required : {
                  value : true,
                  message : "Nama Kelas harus diisi"
                }
              })}
              />
              {errors?.nama_kelas && <small style={{color : 'red'}}>{ errors?.nama_kelas.message}</small>}
            </div>
          </div>
          <div>
            <Button type="submit" color="primary" auto>
              Tambah Kelas
            </Button>
          </div>
        </form>

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
