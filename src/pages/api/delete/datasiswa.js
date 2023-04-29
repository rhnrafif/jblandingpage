import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const dataSiswa = await prisma.data_siswa.findFirst({
            where : {
                id : parseInt(dataInput.id)
            },
        })
        if(dataSiswa.id != 0){
            await prisma.data_siswa.update({
                where : {
                    id : dataSiswa.id
                },
                data : {
                    kelas_id : dataSiswa.kelas_id,
                    nama_lengkap : dataSiswa.nama_lengkap,
                    is_active : false
                }
            })
            .then(()=>{
                res.status(201).json({message : "Berhasil Hapus Data Siswa"})
            })
        }else res.status(401).json({message : "Data Cannot be Null"})
    } catch (error) {
        res.status(500).json({message : error})
    }
}