import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const kelas_detail = await prisma.data_kelas.findFirst({
            where : {
                id : parseInt(dataInput.id),
                is_active : true
            }
        })
        if(kelas_detail.id != 0){
            const dataJurusan = await prisma.lookup.findFirst({
                where : {
                    name : "Jurusan",
                    value : dataInput.nama_jurusan,
                    is_active : true
                }
            })
            
            if(dataJurusan != null){
                if(dataJurusan.value == dataInput.nama_jurusan){
                    await prisma.data_kelas.update({
                        where : {
                            id : kelas_detail.id
                        },
                        data : {
                            jurusan_id : dataJurusan.id.toString(),
                            nama_kelas : dataInput.nama_kelas,
                            is_active : true
                        }   
                    })
                    .then((e)=>{
                        res.status(201).json({message : "Berhasil Update"})
                    })
                }else{
                    await prisma.data_kelas.update({
                        where : {
                            id : kelas_detail.id
                        },
                        data : {
                            jurusan_id : kelas_detail.jurusan_id,
                            nama_kelas : dataInput.nama_kelas,
                            is_active : true
                        }   
                    })
                    .then((e)=>{
                        res.status(201).json({message : "Berhasil Update"})
                    })
                }
            }else res.status(404).json({message : "Jurusan tidak ditemukan"})
        }else res.status(400).json({message : "Kelas tidak ditemukan"})
    } catch (error) {
        res.status(500).json({message : error})
    }
}