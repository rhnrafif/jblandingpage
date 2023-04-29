import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let data = req.body.data
        
        await prisma.data_siswa.update({
                where : {
                    id : data.id
                },
                data : {
                    nama_lengkap : data.nama_lengkap,
                    kelas_id : data.kelas_id,
                    kode_akses : data.kode_akses,
                    is_active : data.is_active
                }
            })
            .then(()=>{
                res.status(200).json({message : "Berhasil Update Kode Akses"})
            })
    } catch (error) {
        res.status(500).json({message : error})
    }
}