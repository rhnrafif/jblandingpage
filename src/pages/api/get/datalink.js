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
        select z.id, y.jur as jurusan, z.mp as mata_pelajaran, z.link as Link_ujian, z.status as status_aktif from (select id, value as jur from "Lookup" where name = 'Jurusan') y
        join (select q.id, p.value as mp, q.jurusan_id, q.link, q.status from (select value, id from "Lookup" where name = 'MataPelajaran') p 
        join ( select c.* from data_siswa a
        join link_ujian c on c.is_active = a.is_active
        where Replace(a.kode_akses,' ','') = ${dataInput.kode_akses} and event_id = ${dataEvent.id.toString()}) q on p.id = cast(q.mapel_id as integer)) z
        on cast(z.jurusan_id as integer) = y.id and y.jur = ${dataInput.jurusan}
        `
        res.status(200).json({dataLink : dataLink, dataEvent : dataEvent})

    } catch (error) {
        res.status(500).json({message : error})
    }
}