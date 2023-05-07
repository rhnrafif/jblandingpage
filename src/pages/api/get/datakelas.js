import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    if(req.body != ''){
        let jurusan = req.body.jurusan
        try {
            const data_kelas = await prisma.$queryRaw`
            SELECT a.id, a.nama_kelas, b.value as jurusan, a.is_active from data_kelas a
            join (select * from "Lookup" where name='Jurusan') b on b.id = cast(a.jurusan_id as integer)
            where a.is_active = true and b.value = ${jurusan} order by a.nama_kelas
            `
            res.status(201).json({data_kelas : data_kelas})      
        } catch (error) {
            res.status(500).json({message : error})
        }
    }else{
        try {
            const data_kelas = await prisma.$queryRaw`
            SELECT a.id, a.nama_kelas, b.value as jurusan, a.is_active from data_kelas a
            join (select * from "Lookup" where name='Jurusan') b on b.id = cast(a.jurusan_id as integer)
            where a.is_active = true order by a.nama_kelas
            `
            res.status(201).json({data_kelas : data_kelas})      
        } catch (error) {
            res.status(500).json({message : error})
        }
    }
}