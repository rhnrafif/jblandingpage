import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        await prisma.lookup.findMany({
            where : {
                name : "MataPelajaran",
                is_active : true
            },
            orderBy : {
                value : 'asc'
            }
        })
        .then((resp)=>{
            res.status(201).json(resp)
        })       
    } catch (error) {
        res.status(500).json({message : error})
    }
}
