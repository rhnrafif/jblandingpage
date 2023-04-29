import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        await prisma.data_kelas.findFirst({
            where : {
                id : parseInt(dataInput.id),
                is_active : true
            }
        }).then((e)=>{
            res.status(201).json(e)
        })
    } catch (error) {
        res.status(500).json({message : error})
    }
}