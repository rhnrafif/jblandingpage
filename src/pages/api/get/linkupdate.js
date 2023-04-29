import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const dataEvent = await prisma.event.findFirst({
            where : {
                tahun_ajaran : dataInput.tahun,
                nama_event : dataInput.event,
                semester : dataInput.semester,
                is_active : true
            }
        })
        const dataLink = await prisma.$queryRaw`
        select id, y.jur as jurusan, z.mp as mata_pelajaran, z.link as Link_ujian from (select id, value as jur from "Lookup" where name = 'Jurusan') y
        join (select p.value as mp, q.jurusan_id, q.link from (select value, id from "Lookup" where name = 'MataPelajaran') p 
        join ( select c.* from data_siswa a
        join link_ujian c on c.is_active = a.is_active
        where a.kode_akses = 'admin' and event_id = ${dataEvent.id.toString()} ) q on p.id = cast(q.mapel_id as integer)) z
        on cast(z.jurusan_id as integer) = y.id
        `
        res.status(200).json({dataLink : dataLink, dataEvent : dataEvent})
    } catch (error) {
        res.status(500).json({message : error})
    }
}