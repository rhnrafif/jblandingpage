import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let kelas_id = req.body.kelas_id
        const data_kelas = await prisma.$queryRaw`
        select cast(ROW_NUMBER() OVER (ORDER BY ds.id) as integer) as No, ds.nama_lengkap as Nama, dkj.nama_kelas as Kelas, Replace(ds.kode_akses, ' ','') as Kode from data_siswa ds 
        join (select dk.id, dk.nama_kelas, dj.value as Jurusan from data_kelas dk 
        join (select * from "Lookup" where name = 'Jurusan' and is_active = true) dj on cast(dk.jurusan_id as integer) = dj.id
        where dk.is_active = true) dkj on cast(ds.kelas_id as integer) = dkj.id
        where ds.is_active = true and ds.kelas_id = ${kelas_id}

        `
        res.status(201).json({data_kelas : data_kelas})      
    } catch (error) {
        res.status(500).json({message : error})
    }
}