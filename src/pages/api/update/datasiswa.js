import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const kode_kelas = await prisma.data_kelas.findFirst({
            where : {
                nama_kelas : dataInput.nama_kelas,
                is_active : true
            }
        })
        if(kode_kelas.id != 0){
            await prisma.data_siswa.update({
                where : {
                    id : dataInput.id
                },
                data : {
                    nama_lengkap : dataInput.nama_lengkap,
                    kelas_id :  kode_kelas.id.toString(),
                    kode_akses : dataInput.kode_akses,
                    is_active : true
                }   
            })
            .then((e)=>{
                res.status(201).json({message : "Berhasil Update"})
            })
        }else res.status(400).json({message : "Kelas tidak ditemukan"})
    } catch (error) {
        res.status(500).json({message : error})
    }
}