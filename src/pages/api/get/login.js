import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        const kodeAkses = req.body.value
        if(kodeAkses != ""){
            const dataLogin = await prisma.$queryRaw`
            select * from data_siswa where Replace(kode_akses,' ','') = ${kodeAkses} and is_active = true
            `
            
            res.status(200).json({data : dataLogin})
        }        
    } catch (error) {
        res.status(500).json({message : error})
    }
}