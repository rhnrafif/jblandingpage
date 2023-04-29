import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const data_kelas = await prisma.data_kelas.findMany({
            where : {
                is_active : true
            }
        });
        const data_siswa = await prisma.data_siswa.findFirst({
            where : {
                id : dataInput.id,
                is_active : true
            }
        })
        res.status(201).json({data_kelas : data_kelas, data_siswa : data_siswa})
    } catch (error) {
        res.status(500).json({message : error})
    }
}