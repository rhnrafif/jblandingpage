import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const dataLookup = await prisma.lookup.findFirst({
            where : {
                id : parseInt(dataInput.id)
            },
        })
        if(dataLookup.id != 0){
            await prisma.lookup.update({
                where : {
                    id : dataLookup.id
                },
                data : {
                    name : dataLookup.name,
                    value : dataLookup.value,
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