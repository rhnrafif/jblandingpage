import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const dataUserInit = await prisma.$queryRaw`
                select c.id, a.nama_lengkap, a.kode_akses, b.nama_kelas, c.link as link_ujian from data_siswa a
                join data_kelas b on cast(a.kelas_id as integer) = b.id
                join link_ujian c on c.jurusan_id = b.jurusan_id
                where Replace(a.kode_akses,' ','') = ${dataInput.kode} and c.status = true
        `
        
        if(dataUserInit.length != 0){
            await prisma.$queryRaw`
                select c.id, a.nama_lengkap, a.kode_akses, b.nama_kelas, d.value as mata_pelajaran, c.link as link_ujian from data_siswa a
                join data_kelas b on cast(a.kelas_id as integer) = b.id
                join link_ujian c on c.jurusan_id = b.jurusan_id
                join "Lookup" d on d.id = cast(c.mapel_id as integer)
                where Replace(a.kode_akses,' ','') = ${dataInput.kode} and c.status = true
                `
                .then((e)=>{
                    res.status(200).json({datauser : dataUserInit, dataLinkUas : e})
                })
        }else{
            await prisma.$queryRaw`
            select a.*, b.nama_kelas from data_siswa a 
            join data_kelas b on cast(a.kelas_id as integer) = b.id
            where Replace(kode_akses,' ','') = ${dataInput.kode}
            `
            .then((e)=>{
                res.status(200).json({datauser : e, dataLinkUas : []})
            })
        }
    } catch (error) {
        res.status(500).json({message : error})
    }
}