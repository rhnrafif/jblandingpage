import React, { useState, useMemo } from 'react'
import {useForm} from "react-hook-form"
import { Table, Row, Col, Tooltip, User, Text, Modal, Button, Input, Dropdown } from "@nextui-org/react";
import { IconButton } from '@/component/TableComponent/IconButton';
import { EditIcon } from "@/component/TableComponent/EditIcon";
import { DeleteIcon } from "@/component/TableComponent/DeleteIcon";
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ListKelas({dataKelas}) {

  const route = useRouter();

  //data
    const columns = [
    { name: "NAMA KELAS", uid: "nama_kelas" },
    { name: "KELOMPOK JURUSAN", uid: "jurusan" },
    { name: "ACTIONS", uid: "actions" }
    ];
  
    const renderCell = (user, columnKey)=>{
      
      const cellValue = user[columnKey];
      switch (columnKey) {
        case "nama_kelas":
          return (
            <Col>
              <Row>
                <Text size={14} css={{ tt: "capitalize" }}>
                  {cellValue}
                </Text>
              </Row>
            </Col>
          );
        case "jurusan":
          return (
            <Col>
              <Row>
                <Text size={14} css={{ tt: "capitalize" }}>
                  {cellValue}
                </Text>
              </Row>
            </Col>
          );

        case "actions":
          return (
            <Row justify="center" align="center">
              <Col css={{ d: "flex" }}>
                <Tooltip content="Edit kelas">
                  <IconButton onClick={()=>{handleEdit(user.id)}}>
                    <EditIcon size={20} fill="#979797" />
                  </IconButton>
                </Tooltip>
              </Col>
              <Col css={{ d: "flex" }}>
                <Tooltip
                  content="Delete kelas"
                  color="error"
                  onClick={()=>{handleConfirm(user.id)}}
                >
                  <IconButton>
                    <DeleteIcon size={20} fill="#FF0080" />
                  </IconButton>
                </Tooltip>
              </Col>
            </Row>
          );
        default:
          return cellValue;
      }
    }

    //handle Edit area
    const [dataKelasEdit, setDataKelasEdit] = useState({})
    const {handleSubmit, register} = useForm();
      
    //set modal
      const [isModal, setIsModal] = useState(false);

      //get data exist want to update
      const handleEdit = async(id)=>{
        
        try {
          await axios.post('/api/get/kelasupdate', {id : id})
          .then((e)=>{
            setDataKelasEdit(e.data);
            setIsModal(true)
          })
          .catch((err)=>{
            alert(`Terjadi kesalahan, ${err.response.data.message}`)
          })
        } catch (error) {
          alert('Action Failed, Please try again');
        }
      }

    const handleEditForm = async(e)=>{
        let j = e.nama_kelas.split(' ')
        j.pop()
      
      if(e.nama_kelas == " "){
         alert('Nama Kelas tidak boleh kosong');
         return
      }

      const dataInput = {
        id : dataKelasEdit.id,
        jurusan_id : dataKelasEdit.jurusan_id,
        nama_kelas : e.nama_kelas.toUpperCase(),
        nama_jurusan : j.join(' ').toUpperCase()
      }

      try {
        await axios.put("/api/update/datakelas", dataInput)
        .then((e)=>{
          setIsModal(false)
          window.location.reload()  
        })
        .catch((err)=>{
            alert(`Terjadi kesalahan, ${err.response.data.message}`)
        })
      } catch (error) {
        alert('Action Failed, Please try again');
      }
    }

    //hanlde Delete area

    const[isModalDelete, setIsModalDelete] = useState(false);
    const[confirm, setConfirm] = useState(0)

    const handleConfirm = async(id)=>{
      setConfirm(id)
      setIsModalDelete(!isModalDelete)
    }

    const handleDelete = async(id)=>{
      try {
        await axios.put("/api/delete/datakelas", {id : id})
        .then(()=>{
          setIsModalDelete(false)
          window.location.reload()  
        })
      } catch (error) {
        alert('Action Failed, Please try again');
      }
    }

  return (
    <>
    <div className='max-w-[760px]'>
          <Table
          aria-label="Example table with custom cells"
          css={{
            height: "auto",
            width : "100%"

          }}
          selectionMode="none"
        >
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column
                  key={column.uid}
                  hideHeader={column.uid === "actions"}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body items={dataKelas}>
              {(item) => (
                <Table.Row>
                  {(columnKey) => (
                    <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
          </Table>

          {/* modal update area */}
          <Modal
            closeButton
            aria-labelledby="modal-title"
            open={isModal}
            onClose={()=>{setIsModal(false)}}
          >
            <Modal.Header className='flex flex-col justify-center items-center gap-1' >
              <Text id="modal-title" size={16}>
                Update Kelas
              </Text>
              <Text id="modal-title" b size={18}>
                {dataKelasEdit.nama_kelas}
              </Text>
            </Modal.Header>
            <Modal.Body>
            <form action="" className="flex flex-col gap-3 items-center justify-center" onSubmit={handleSubmit(handleEditForm)}>
                <div className="flex gap-2 items-center justify-center w-full">
                    <Input clearable label="Nama Kelas" name="nama_kelas" width="240px"  placeholder={dataKelasEdit.nama_kelas}
                    
                    {... register("nama_kelas")}
                    />
                </div>

                <div>
                    <Button type="submit" color="primary" className='mt-[32px]' auto>
                      Submit
                    </Button>
                </div>
            </form>
            </Modal.Body>
          </Modal>

          <Modal
            closeButton
            aria-labelledby="modal-title"
            preventClose
            open={isModalDelete}
            onClose={()=>{setIsModalDelete(false)}}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                Yakin Hapus Data ?
              </Text>
            </Modal.Header>
            <Modal.Footer>
              <div>
                <Button type="submit" bordered color="primary" auto onPress={()=>{handleDelete(confirm)}}>
                  YA
                </Button>
              </div>
              <div>
                <Button type="submit" flat color="error" auto onPress={()=>{setIsModalDelete(false)}}>
                  Tidak
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
    </div>
      
    </>
  )
}
