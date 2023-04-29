import React from 'react'
import {Dropdown, Input, Button, Modal, Text} from "@nextui-org/react"
import {useForm} from "react-hook-form"
import {useState, useMemo} from "react"
import { useRouter } from 'next/router'
import axios from 'axios'


export default function InputUAS({dataEvent}) {
    
     const {handleSubmit, register} = useForm();

     const route = useRouter()
    
      //set modal
    const [isModal, setIsModal] = useState(false);
    const handleModal = ()=>{
      setIsModal(!isModal)
      document.getElementById('inputUAS').value = ""
      route.push('/admin')
    }

    //item dropdown

    const [selectedKelas, setSelectedKelas] = useState(["Pilih Kelas"]);
    const [selectedMapel, setSelectedMapel] = useState(["Mata Pelajaran"]);
    
    const selectedKelasValue = useMemo(
        () => Array.from(selectedKelas).join(", ").replaceAll("_", " "),
        [selectedKelas]
    );

    const selectedMapelValue = useMemo(
        () => Array.from(selectedMapel).join(", ").replaceAll("_", " "),
        [selectedMapel]
    );

  const submitUAS = async(e)=>{

    if(selectedKelasValue == "Pilih Kelas"){
        alert('Kelas harus dipilih')
        return
    }
    if(selectedMapelValue == "Mata Pelajaran"){
        alert('Mata Pelajaran harus dipilih')
        return
    }
    if(e.link == " "){
        alert("Link tidak boleh kosong")
        return
    }

    const dataInput = {
        mapel : selectedMapelValue,
        jurusan : selectedKelasValue,
        link : e.link,
        event_id : 1
    }

    //area hit API
    try {
        await axios.post(`/api/add/datalink`, dataInput)
        .then((e)=>{
          if(e.status == 201){
            setIsModal(!isModal)
          }
        })
        .catch((e)=>{
          
        })
    } catch (error) {
        console.log(error)
    }
  }
    

  return (
    <div className="flex flex-col gap-4 items-center">
        <p className="text-lg font-semibold">Tambah Link UAS</p>
        <form action="" className="flex flex-col gap-3 items-center" onSubmit={handleSubmit(submitUAS)}>
            <div className="flex gap-2 items-center justify-between w-full">
                
                <div className="flex flex-col gap-2 items-center">
                    <p>Mata Pelajaran</p>
                    <Dropdown>
                        <Dropdown.Button color="primary" ghost css={{ tt: "capitalize" }}>
                            {selectedMapel}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="primary"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedMapel}
                            onSelectionChange={setSelectedMapel}
                            items={dataEvent.dataMapel}
                        >
                            {(i)=>(
                                <Dropdown.Item key={i.value}>
                                    {i.value}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="flex flex-col gap-2 items-center">
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
                            items={dataEvent.dataJurusan}
                        >
                            {(i)=>(
                                <Dropdown.Item key={i.value}>
                                    {i.value}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                
            </div>
            <div>
                <Input clearable label="Link" name="link" width="420px" id='inputUAS' required
                
                {... register("link")}
                />
            </div>
            
            <div>
                    <Button type="submit" color="primary" auto>
                    Tambah
                </Button>
            </div>
        </form>
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
