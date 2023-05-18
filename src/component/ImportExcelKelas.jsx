import React, {useState, useContext} from 'react'
import {read, utils, writeFile} from 'xlsx'
import {UploadOutlined} from "@ant-design/icons"
import {Button as AntdButton, message, Upload} from 'antd'
import { Table, Modal, Button, Text, Loading } from '@nextui-org/react'
import axios from 'axios'
import { LoadingState } from './GlobalState/IsLoadingProvider'

export default function ImportExcelKelas() {

    
  const [dataExcelKelas, setDataExcelKelas] = useState([])
  const [isLoad, setIsLoad] = useState(false)
  const [isModalImportKelas, setIsModalImportKelas] = useState(false);
  const [isImportR, setIsImportR] = useState(false);

  const handleImport = ($event) => {
        if(dataExcelKelas.length > 0){
            return
        }
        if(isModalImportKelas)
            setIsImportR(false)
        
        const files = $event.fileList;
        if($event.file.status == "done"){
            if (files.length) {
                const fileName = files[0].name.split('.');
                if(!fileName[0].toLowerCase().includes("datakelas")){
                    return alert('Nama File tidak cocok')
                }

                const file = files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const wb = read(event.target.result);
                    const sheets = wb.SheetNames;
    
                    if (sheets.length) {
                        const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                        setDataExcelKelas(rows)
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
        setIsModalImportKelas(false)
        setIsLoad(true)
        try {
            await axios.post(`/api/add/datakelasexcel`, {data : e})
            .then((e)=>{
              if(e.status == 201){
                setIsLoad(false)
                setTimeout(() => {alert(e.data.message)}, 800);
              }
            })
            .catch((err)=>{
              setIsLoad(false)
              setIsModalImportKelas(true)
              setTimeout(()=>{alert(`Terjadi kesalahan, ${err.response.data.message}`)},1500)
            })
        } catch (error) {alert('Action Failed, Please try again');}
    }
  }

  //data
    const columns = [
        {
          key: "KELAS",
          label: "KELAS",
        }
      ];
  
    return (
      <>
        <div className="flex flex-col gap-4 items-center">
            <p className="text-lg font-semibold">Import data Kelas</p>
            <Upload name='file' accept='.xls, .xlsx' onChange={handleImport} onRemove={()=>{setDataExcelKelas([])}} maxCount={1}>
                <AntdButton icon={<UploadOutlined />}>Click to Upload</AntdButton>
            </Upload>
            {(isImportR && dataExcelKelas.length > 0) && (
              <>
                    <Button auto bordered size={'sm'} onPress={()=>{setIsModalImportKelas(true)}}>
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

          

          {(isModalImportKelas) && (
            <>
              {(dataExcelKelas.length > 0) && (
                <>
                  <Modal
                  closeButton
                  aria-labelledby="modal-title"
                  onClose={()=>{setIsModalImportKelas(false)}}
                  open={isModalImportKelas}
                  >
                      <>
                        <Modal.Header>
                            <Text size={18}>Konfirmasi Input File ?</Text>
                        </Modal.Header>
                        <Modal.Body>
                              <Table
                                  aria-label="Example table with dynamic content"
                                  css={{
                                    height: "auto",
                                    width : "fit-content",
                                    minWidth: "100%",
                                    fontSize : "14px",
                                  }}
                                >
                                  <Table.Header columns={columns}>
                                    {(column) => (
                                      <Table.Column key={column.key}>{column.label}</Table.Column>
                                    )}
                                  </Table.Header>
                                  <Table.Body items={dataExcelKelas}>
                                    {(item) => (
                                        <Table.Row key={item.KELAS}>
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
                          <Button auto onPress={()=>{submitImport(dataExcelKelas)}} >SUBMIT</Button>
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
