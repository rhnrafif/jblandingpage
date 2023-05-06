import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        if(dataInput.nama_lengkap != ""){
            const kelasId = await prisma.data_kelas.findFirst({
                where : {
                    nama_kelas : dataInput.nama_kelas,
                    is_active : true
                }
            })
            if(kelasId != null){
                await prisma.data_siswa.create({
                data : {
                    nama_lengkap : dataInput.nama_lengkap,
                    kelas_id : kelasId.id.toString(),
                    kode_akses : dataInput.kode_akses,
                    is_active : true
                    }
                })
                .then((response)=>{
                    res.status(201).json({message : "Data Siswa Was Create"})
                })
            }else res.status(404).json({message : "Kelas tidak ditemukan"})
        } else res.status(400).json({message : "Nama Lengkap tidak boleh kosong"})       
    } catch (error) {
        res.status(500).json({message : error})
    }
}