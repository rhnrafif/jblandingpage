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


export default function ListSiswaInput({dataSiswa}) {

  const route = useRouter();

  //data
    const columns = [
    { name: "NAMA", uid: "nama_lengkap" },
    { name: "KELAS", uid: "kelas_id" },
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
        default:
          return cellValue;
      }
    }

  return (
    <>
    <div className=' max-w-[760px]'>
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
            <Table.Pagination
                
                align="center"
                rowsPerPage={5}
            />
          </Table>
    </div>
    </>
  )
}