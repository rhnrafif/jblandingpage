import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let id = req.body.id;
        const dataLink = await prisma.link_ujian.findFirst({
            where : {
                id : id,
                is_active : true
            }
        })

        if(dataLink != null){

            await prisma.link_ujian.update({
                where : {
                    id : id
                },
                data : {
                    event_id : dataLink.event_id,
                    jurusan_id : dataLink.jurusan_id,
                    mapel_id : dataLink.mapel_id,
                    link : dataLink.link,
                    status : !dataLink.status,
                    is_active : dataLink.is_active
                }
            }).then(()=>{
                res.status(200).json({message : "Berhasil Ubah Status"})
            })
        }else res.status(404).json({message : "Link Ujian tidak ditemukan"})
        
    } catch (error) {
        res.status(500).json({message : error})
    }
}