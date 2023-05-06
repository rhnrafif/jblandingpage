import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let data = req.body.data

        const dataUser = await prisma.data_siswa.findFirst({
            where : {
                id : data.id,
                is_active : true
            }
        })

        if(dataUser != null){
             await prisma.data_siswa.update({
                where : {
                    id : dataUser.id
                },
                data : {
                    nama_lengkap : dataUser.nama_lengkap,
                    kelas_id : dataUser.kelas_id,
                    kode_akses : data.kode_akses,
                    is_active : dataUser.is_active
                }
            })
            .then(()=>{
                res.status(200).json({message : "Berhasil Update Kode Akses"})
            })
        } else res.status(404).json({message : "Data Siswa tidak ditemukan"})
    } catch (error) {
        res.status(500).json({message : error})
    }
}