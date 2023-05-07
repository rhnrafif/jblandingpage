import React, { useState, useMemo } from 'react'
import {useForm} from "react-hook-form"
import { Table, Row, Col, Tooltip, User, Text, Modal, Button, Input, Dropdown, Switch } from "@nextui-org/react";
import { IconButton } from '@/component/TableComponent/IconButton';
import { EyeIcon } from "@/component/TableComponent/EyeIcon";
import { EditIcon } from "@/component/TableComponent/EditIcon";
import { DeleteIcon } from "@/component/TableComponent/DeleteIcon";
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ListUAS({dataLink}) {

  const route = useRouter();

  const hanldeSwith = async(id, status)=>{
    await axios.post("/api/update/switchlinkstatus", {id : id})
    .then((e)=>{
      alert('Berhasil Ubah Status')
      route.push("/admin/view")
    }).catch((err)=>{alert(`Terjadi kesalahan, ${err.message}`); window.location.reload()})
  }

  //data
    const columns = [
    { name: "MATA PELAJARAN", uid: "mata_pelajaran" },
    { name: "KELAS / JURUSAN", uid: "jurusan" },
    { name : "STATUS", uid : "status_aktif"},
    { name: "LINK", uid: "link_ujian" },
    { name: "ACTIONS", uid: "actions" },
    ];
  
    const renderCell = (user, columnKey)=>{
      
      const cellValue = user[columnKey];
      switch (columnKey) {
        case "mata_pelajaran":
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
                <Text b size={14} css={{ tt: "capitalize" }}>
                  {cellValue}
                </Text>
              </Row>
            </Col>
          );

        case "link_ujian":
          return (
            <Col>
              <Row>
                <Text size={14} css={{ tt: "capitalize", maxWidth:"320px" }}>
                  {cellValue}
                </Text>
              </Row>
            </Col>
          );
        
        case "status_aktif":
          return (
            <Col>
              <Row>
                <Switch size="sm" color="primary" bordered checked={cellValue} onChange={()=>{hanldeSwith(user.id)}} />
              </Row>
            </Col>
          );

        case "actions":
          return (
            <Row justify="center" align="center" >
              <Col css={{ d: "flex" }}>
                <Tooltip content="Edit Link">
                  <IconButton onClick={()=>{handleEdit(user.id)}}>
                    <EditIcon size={20} fill="#979797" />
                  </IconButton>
                </Tooltip>
              </Col>
              <Col css={{ d: "flex" }}>
                <Tooltip
                  content="Delete Link"
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
    const [dataLinkEdit, setDataLinkEdit] = useState({})
    const [namaLink, setNamaLink] = useState("")
    const {handleSubmit, register} = useForm();
    const [dataMapelUasEdit, setDataMapelUasEdit] = useState([])
    const [dataEventUasEdit, setDataEventUasEdit] = useState([])
    const [dataJurusantUasEdit, setDataJurusanUasEdit] = useState([])

      
    //set modal
      const [isModal, setIsModal] = useState(false);

      //get data exist want to update
      const handleEdit = async(id)=>{
        await axios.get(`/api/get/datamapel`).then((e)=>{setDataMapelUasEdit(e.data)});
        await axios.get(`/api/get/dataevent`).then((e)=>{setDataEventUasEdit(e.data)});
        await axios.get(`/api/get/datajurusan`).then((e)=>{setDataJurusanUasEdit(e.data)});
        const data = dataLink.dataLink
        data.forEach(e => {
            if(e.id == id){
                setDataLinkEdit(e);
                setNamaLink(e.mata_pelajaran)
                setIsModal(true)
            }
        });
      }

      const handleClose = ()=>{
        setNamaSiswa("");
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

    const handleEditForm = async(e)=>{

        if(selectedKelasValue == "Pilih Kelas"){
            alert('Kelas harus dipilih')
            return
        }
        if(selectedMapelValue == "Mata Pelajaran"){
            alert('Mata Pelajaran harus dipilih')
            return
        }

        const dataInput = {
            id : dataLinkEdit.id,
            mapel : selectedMapelValue,
            jurusan : selectedKelasValue,
            link : e.link,
            event_id : 1
        }

        //area hit API
        try {
            await axios.post(`/api/update/datalink`, dataInput)
            .then((e)=>{
            if(e.status == 201){
                setIsModal(false)
                window.location.reload()  
            }
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
        await axios.put("/api/delete/datalink", {id : id})
        .then(()=>{
          setIsModalDelete(false)
          window.location.reload()  
        })
      } catch (error) {
        
      }
    }

  return (
    <>
    <div className='w-full'>
          <Table
          aria-label="Example table with custom cells"
          css={{
            height: "auto",
            width : "920px"

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
            <Table.Body items={dataLink.dataLink}>
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
            width='460px'
            aria-labelledby="modal-title"
            open={isModal}
            onClose={()=>{setIsModal(false)}}
          >
            <Modal.Header className='flex flex-col justify-center items-center gap-1'>
              <Text id="modal-title" size={16}>
                Update Link untuk Mata Pelajaran
              </Text>
              <Text id="modal-title" b size={18}>
                {namaLink}
              </Text>
            </Modal.Header>
            <Modal.Body>
            <form action="" className="flex flex-col gap-3 items-center" onSubmit={handleSubmit(handleEditForm)}>
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
                                items={dataMapelUasEdit}
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
                                items={dataJurusantUasEdit}
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
                    <Input clearable label="Link" name="link" width="420px" id='inputUAS' required placeholder={dataLinkEdit.link_ujian}
                    
                    {... register("link")}
                    />
                </div>
                
                <div>
                    <Button type="submit" color="primary" auto>
                        UPDATE
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
