import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        
        if(dataInput != null){
            const kelasId = await prisma.data_kelas.findFirst({
            where : {
                nama_kelas : dataInput.value,
                is_active : true
                }
            })
            if(kelasId != null){
                await prisma.data_siswa.findMany({
                    where : {
                        kelas_id : kelasId.id.toString(),
                        is_active : true
                    },
                    orderBy : {
                        nama_lengkap : 'asc'
                    }
                })
                .then((e)=>{
                    res.status(201).json({data_siswa : e, nama_kelas : kelasId.nama_kelas })
                })
            } else res.status(400).json({message : "Kelas is Not Exist"})
            
        }else res.status(401).json({message : "Data Cannot be Null"})
    } catch (error) {
        res.status(500).json({message : error})
    }
}