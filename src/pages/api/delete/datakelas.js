import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const dataKelas = await prisma.data_kelas.findFirst({
            where : {
                id : parseInt(dataInput.id)
            },
        })
        if(dataKelas.id != 0){
            await prisma.data_kelas.update({
                where : {
                    id : dataKelas.id
                },
                data : {
                    kelas_id : dataKelas.kelas_id,
                    nama_lengkap : dataKelas.nama_lengkap,
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