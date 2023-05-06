import React, { useState, useMemo } from 'react'
import {useForm} from "react-hook-form"
import { Table, Row, Col, Tooltip, User, Text, Modal, Button, Input, Dropdown } from "@nextui-org/react";
import { IconButton } from '@/component/TableComponent/IconButton';
import { EditIcon } from "@/component/TableComponent/EditIcon";
import { DeleteIcon } from "@/component/TableComponent/DeleteIcon";
import axios from 'axios';
import { useRouter } from 'next/router';
import { utils, writeFile } from "xlsx"
import moment from 'moment/moment';
import {BsFillDice5Fill} from "react-icons/bs"


export default function ListSiswa({dataSiswa}) {

  const route = useRouter();

  //data
    const columns = [
    { name: "NAMA", uid: "nama_lengkap" },
    { name: "KELAS", uid: "kelas_id" },
    { name: "KODE AKSES", uid: "kode_akses" },
    { name: "ACTIONS", uid: "actions" },
    ];
  
    const renderCell = (user, columnKey)=>{
      
      const cellValue = user[columnKey];
      switch (columnKey) {
        case "nama_lengkap":
          return (
            <Col>
              <Row>
                <Text size={14} css={{ tt: "capitalize" }}>
                  {cellValue}
                </Text>
              </Row>
            </Col>
          );

        case "kelas_id":
          return (
            <Col>
              <Row>
                <Text size={14} css={{ tt: "capitalize" }}>
                  {dataSiswa.nama_kelas}
                </Text>
              </Row>
            </Col>
          );

        case "kode_akses":
          return (
            <Col>
              <Row>
                <Text b size={14} css={{ tt: "capitalize" }}>
                  {cellValue}
                </Text>
              </Row>
            </Col>
          );

        case "actions":
          return (
            <Row justify="center" align="center">
              <Col css={{ d: "flex" }}>
                <Tooltip content="Edit user">
                  <IconButton onClick={()=>{handleEdit(user.id)}}>
                    <EditIcon size={20} fill="#979797" />
                  </IconButton>
                </Tooltip>
              </Col>
              <Col css={{ d: "flex" }}>
                <Tooltip
                  content="Delete user"
                  color="error"
                  onClick={()=>{handleConfirm(user.id)}}
                >
                  <IconButton>
                    <DeleteIcon size={20} fill="#FF0080" />
                  </IconButton>
                </Tooltip>
              </Col>
              <Col css={{ d: "flex" }}>
                <Tooltip
                  content="Update Kode"
                  color="primary"
                  onClick={()=>{handleKode(user.id)}}
                >
                  <IconButton>
                    <BsFillDice5Fill  />
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
    const [dataSiswaEdit, setDataSiswaEdit] = useState({})
    const [namaSiswa, setNamaSiswa] = useState("")
    const {handleSubmit, register} = useForm();
      
    //set modal
      const [isModal, setIsModal] = useState(false);

      //get data exist want to update
      const handleEdit = async(id)=>{
            try {
              await axios.post('/api/get/siswaupdate', {id : id})
              .then((e)=>{
                setDataSiswaEdit(e.data);
                setNamaSiswa(e.data.data_siswa.nama_lengkap)
                setIsModal(true)
              })
            } catch (error) {
              alert('Action Failed, Please try again');
            }
      }

      const handleClose = ()=>{
        setNamaSiswa("");
      }

      //item dropdown

      const [selectedKelas, setSelectedKelas] = useState(dataSiswa.nama_kelas);
      const selectedKelasValue = useMemo(
          () => Array.from(selectedKelas).join(", ").replaceAll("_", " "),
          [selectedKelas]
      );

    const handleEditForm = async(e)=>{
      let kelas = selectedKelasValue.includes(",") ? selectedKelasValue.replaceAll(", ","") : selectedKelasValue

      if(e.nama_lengkap == " "){
        alert('Nama Lengkap tidak boleh kosong')
        return
      }

      const dataInput = {
        id : dataSiswaEdit.data_siswa.id,
        nama_lengkap : e.nama_lengkap.toUpperCase(),
        nama_kelas : kelas,
        kode_akses : dataSiswaEdit.data_siswa.kode_akses
      }
      try {
        await axios.put("/api/update/datasiswa", dataInput)
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

    const handleUpdateCode = async(e)=>{
      let dataSiswaKode = []
      const dataArr = e.data_siswa;
      dataArr.forEach(element => {
        let d = {
          id : element.id,
          is_active : element.is_active,
          kelas_id : element.kelas_id,
          nama_lengkap : element.nama_lengkap,
          kode_akses : generateString(6)
        }

        try {
          axios.post('/api/update/kodesiswa', {data : d})
          .then((e)=>{
            })
          .catch((err)=>{
              alert(`Terjadi kesalahan, ${err.response.data.message}`)
          })
        } catch (error) {
          alert('Action Failed, Please try again');
        }
      });

      alert('Berhasil update kode akses')
      window.location.reload() 
      
      
    }

    const handleKode = async(e)=>{
      
      const dataUserKode = {
        id : e,
        kode_akses : generateString(6)
      }

      try {
          axios.post('/api/update/onesiswacode', {data : dataUserKode})
          .then((e)=>{
                alert('Berhasil update kode akses')
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
        await axios.put("/api/delete/datasiswa", {id : id})
        .then(()=>{
          setIsModalDelete(false)
          window.location.reload()  
        })
      } catch (error) {
        
      }
    }


    //hanlde Download area
    const handleExcel = async(kelas_id)=>{
      
      try {
        await axios.post(`/api/get/dataexcelsiswa`, {kelas_id : kelas_id})
        .then((e)=>{
          let date = moment().format('l')
          const worksheet = utils.json_to_sheet(e.data.data_kelas)
          const workbook = utils.book_new();
          utils.book_append_sheet(workbook, worksheet, "Sheet1");
          writeFile(workbook, `DataSiswa_${e.data.data_kelas[0].kelas}_${date}.xlsx`)
        })
      } catch (error) {
        alert('Download gagal, mohon ulangi kembali')
        window.location.reload()
      }
    }

  return (
    <>
    {(dataSiswa.data_siswa.length != 0) && (
      <div className='w-full flex justify-between'>
        <div>
          <Button auto bordered onPress={()=>{handleUpdateCode(dataSiswa)}}>
            Update All Kode Akses
          </Button>
        </div>
        <Button auto css={{height : '100%', display : 'flex', flexDirection : 'column'}} onPress={()=>{handleExcel(dataSiswa.data_siswa[0].kelas_id)}} >
            <p className='mx-2'>Download Excel </p>
        </Button>
      </div>
    )}
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
            <Table.Body items={dataSiswa.data_siswa}>
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
            <Modal.Header className='flex flex-col justify-center items-center gap-1'>
              <Text id="modal-title" size={16}>
                Update Data
              </Text>
              <Text id="modal-title" b size={18}>
                {namaSiswa}
              </Text>
            </Modal.Header>
            <Modal.Body>
            <form action="" className="flex flex-col gap-3 items-center" onSubmit={handleSubmit(handleEditForm)}>
                <div className="flex gap-2 items-center justify-between w-full">
                    <Input clearable label="Nama Lengkap" name="nama_lengkap" width="240px"  placeholder={namaSiswa}
                    
                    {... register("nama_lengkap")}
                    />
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
                                items={dataSiswaEdit.data_kelas}
                            >
                                {(i)=>(
                                    <Dropdown.Item key={i.nama_kelas}>
                                        {i.nama_kelas}
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                
                <div>
                    <Button type="submit" bordered color="primary" auto>
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

function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
