import React, {useState, useContext} from 'react'
import {read, utils, writeFile} from 'xlsx'
import {UploadOutlined} from "@ant-design/icons"
import {Button as AntdButton, message, Upload} from 'antd'
import { Table, Modal, Button, Text, Loading } from '@nextui-org/react'
import axios from 'axios'
import { LoadingState } from './GlobalState/IsLoadingProvider'

export default function ImportExcelSiswa() {

    
  const [dataExcel, setDataExcel] = useState([])
  const [isLoad, setIsLoad] = useState(false)
  const [isModalImport, setIsModalImport] = useState(false);
  const [isImportR, setIsImportR] = useState(false);

  const handleImport = ($event) => {
        if(dataExcel.length > 0){
            return
        }
        if(isModalImport)
            setIsImportR(false)
        
        const files = $event.fileList;
        if($event.file.status == "done"){
            if (files.length) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const wb = read(event.target.result);
                    const sheets = wb.SheetNames;
    
                    if (sheets.length) {
                        const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                        setDataExcel(rows)
                    }
                }
                reader.readAsArrayBuffer(file.originFileObj);
            }
                setIsImportR(true)
        }
    }

  const submitImport = async(e)=>{
    if(e.length != 0){
        //area hit API
        setIsModalImport(false)
        setIsLoad(true)
        try {
            await axios.post(`/api/add/datasiswaexcel`, {data : e})
            .then((e)=>{
              if(e.status == 201){
                setIsLoad(false)
                setTimeout(() => {alert(e.data.message)}, 800);
              }
            })
            .catch((err)=>{
              setIsLoad(false)
              setIsModalImport(true)
              setTimeout(()=>{alert(`Terjadi kesalahan, ${err.response.data.message}`)},1500)
            })
        } catch (error) {alert('Action Failed, Please try again');}
    }
  }

  //data
    const columns = [
        {
          key: "NAMA",
          label: "NAMA",
        },
        {
          key: "KELAS",
          label: "ROLE",
        },
      ];
  
    return (
      <>
        <div className="flex flex-col gap-4 items-center">
            <p className="text-lg font-semibold">Input data Siswa</p>
            <Upload name='file' accept='.xls, .xlsx' onChange={handleImport} onRemove={()=>{setDataExcel([])}} maxCount={1}>
                <AntdButton icon={<UploadOutlined />}>Click to Upload</AntdButton>
            </Upload>
            {(isImportR && dataExcel.length > 0) && (
              <>
                    <Button auto bordered size={'sm'} onPress={()=>{setIsModalImport(true)}}>
                        Import
                    </Button>
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

          

          {(isModalImport) && (
            <>
              {(dataExcel.length > 0) && (
                <>
                  <Modal
                  closeButton
                  aria-labelledby="modal-title"
                  onClose={()=>{setIsModalImport(false)}}
                  open={isModalImport}
                  >
                      <>
                        <Modal.Header>
                            <Text size={18}>Konfirmasi Input File {dataExcel[0].KELAS} ?</Text>
                        </Modal.Header>
                        <Modal.Body>
                              <Table
                                  aria-label="Example table with dynamic content"
                                  css={{
                                    height: "auto",
                                    minWidth: "100%",
                                    fontSize : "14px"
                                  }}
                                >
                                  <Table.Header columns={columns}>
                                    {(column) => (
                                      <Table.Column key={column.key}>{column.label}</Table.Column>
                                    )}
                                  </Table.Header>
                                  <Table.Body items={dataExcel}>
                                    {(item) => (
                                        <Table.Row key={item.NAMA}>
                                          {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
                                        </Table.Row>
                                    )}
                                  </Table.Body>
                                  <Table.Pagination  
                                      align="center"
                                      rowsPerPage={8}
                                  />
                                </Table>
                        </Modal.Body>
                        <Modal.Footer
                        justify='center'
                        >
                          <Button auto onPress={()=>{submitImport(dataExcel)}} >SUBMIT</Button>
                        </Modal.Footer>
                      </>
                  </Modal>
                </>
              )}
            </>
          )}

        </div>
      </>
  )
}
