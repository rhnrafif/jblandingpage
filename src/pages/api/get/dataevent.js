import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        await prisma.event.findMany({
            where : {
                nama_event : "UAS",
                is_active : true
            }
        })
        .then((resp)=>{
            res.status(201).json(resp)
        })       
    } catch (error) {
        res.status(500).json({message : error})
    }
}
