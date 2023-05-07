import React from 'react'
import {Dropdown, Input, Button, Modal, Text} from "@nextui-org/react"
import {useForm} from "react-hook-form"
import {useState, useMemo} from "react"
import axios from 'axios'
import { useRouter } from 'next/router'


export default function InputLookup() {
  const {handleSubmit, register, watch, formState:{errors}} = useForm();

  const route = useRouter();
    
//item dropdown
    const [selectedMapel, setSelectedMapel] = useState(["Pilih"]);
    const selectedMapelValue = useMemo(
        () => Array.from(selectedMapel).join(", ").replaceAll("_", " "),
        [selectedMapel]
    );

     //set modal
    const [isModal, setIsModal] = useState(false);
    const handleModal = ()=>{
      setIsModal(!isModal)
      document.getElementById('inputLookup').value = ""
      route.push('/admin')
    }


  const submitKelas = async(e)=>{

    if(selectedMapelValue == "Pilih"){
      alert("Name harus dipilih")
      return
    }
    if(e.value_name == " "){
      alert('Value tidak boleh kosong')
    }

    const dataInput = {
      name : selectedMapelValue,
      value : e.value_name.toUpperCase()
    }

    //area hit API
    try {
        await axios.post("/api/add/lookup", dataInput)
        .then((e)=>{
            if(e.status == 201){
              setIsModal(!isModal)
            }
        })
        .catch((err)=>{
          alert(`Terjadi kesalahan, ${err.response.data.message}`)
        })
    } catch (error) {alert('Action Failed, Please try again');}
  }
    

  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-lg font-semibold">Input Lookup</p>
      <form action="" className="flex flex-col gap-5 items-center" onSubmit={handleSubmit(submitKelas)}>
        
        <div className="flex gap-5 items-start justify-between w-full">      
            <div className="flex flex-col gap-2 items-center text-black">
                <p>Lookup</p>
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
                    >
                      <Dropdown.Item key="Jurusan">
                          Jurusan
                      </Dropdown.Item>
                      <Dropdown.Item key="MataPelajaran">
                          Mata Pelajaran
                      </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            
            <div className="flex flex-col gap-2 items-center justify-between w-full ">
              <p>Value</p>
              <div className='flex flex-col items-start gap-1'>
                <Input clearable placeholder='Value' name="value_name" width="240px" color='primary' bordered id='inputLookup'
                
                {... register("value_name", {
                  required : {
                    value : true,
                    message : "Value harus diisi"
                  }
                })}
                />
                {(errors?.value_name )&& (<small style={{color : 'red'}}>{errors?.value_name.message}</small>)}                                        
              </div>
          </div>
        </div>
        <div>
              <Button type="submit" color="primary" auto>
                Submit
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
