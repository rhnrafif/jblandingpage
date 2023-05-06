import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        if(dataInput.nama_kelas != null && dataInput.jurusan != null){
            const dataJurusan = await prisma.lookup.findFirst({
            where : {
                value : dataInput.jurusan,
                is_active : true
                }
            })
            if(dataJurusan != null){
                await prisma.data_kelas.create({
                    data : {
                        jurusan_id : dataJurusan.id.toString(),
                        nama_kelas : dataInput.nama_kelas,
                        is_active : true
                    }
                })
                .then((e)=>{
                    res.status(201).json({message : "Kelas Was Created"})
                })
            } else res.status(404).json({message : "Jurusan tidak ditemukan"})
            
        }else res.status(400).json({message : "Nama Kelas / Jurusan tidak boleh kosong"})
    } catch (error) {
        res.status(500).json({message : error})
    }
}