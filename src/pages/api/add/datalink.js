import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        
        const dataEvent = await prisma.event.findFirst({
            where : {
                id : parseInt(dataInput.event_id),
                is_active : true
                }
            })
        const dataMapel = await prisma.lookup.findFirst({
            where : {
                name : 'MataPelajaran',
                is_active : true,
                value : dataInput.mapel
            }
        })
        const dataJurusan = await prisma.lookup.findFirst({
            where : {
                name : 'Jurusan',
                is_active : true,
                value : dataInput.jurusan
            }
        })
        if(dataJurusan != null){
            if(dataEvent != null){
                if(dataMapel != null){
                    await prisma.link_ujian.create({
                        data : {
                            event_id : dataEvent.id.toString(),
                            jurusan_id : dataJurusan.id.toString(),
                            mapel_id : dataMapel.id.toString(),
                            link : dataInput.link,
                            is_active : true
                        }
                    })
                    .then((e)=>{
                        res.status(201).json({message : "Kelas Was Created"})
                    })
                } else res.status(404).json({message : "Mata Pelajaran tidak ditemukan"})
            } else res.status(404).json({message : "Event tidak ditemukan"})
        } else res.status(404).json({message : "Jurusan tidak ditemukan"})
        
    } catch (error) {
        res.status(500).json({message : error})
    }
}