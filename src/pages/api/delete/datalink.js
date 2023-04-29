import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const dataLink = await prisma.link_ujian.findFirst({
            where : {
                id : parseInt(dataInput.id)
            },
        })
        if(dataLink.id != 0){
            await prisma.link_ujian.update({
                where : {
                    id : dataLink.id
                },
                data : {
                    event_id : dataLink.event_id,
                    jurusan_id : dataLink.jurusan_id,
                    mapel_id : dataLink.mapel_id,
                    link : dataLink.link,
                    is_active : false
                }
            })
            .then(()=>{
                res.status(201).json({message : "Berhasil Hapus Data Kelas"})
            })
        }else res.status(401).json({message : "Data Cannot be Null"})
    } catch (error) {
        res.status(500).json({message : error})
    }
}