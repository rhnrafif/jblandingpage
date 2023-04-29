import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const data_lookup = await prisma.lookup.findFirst({
            where : {
                id : parseInt(dataInput.id),
                is_active : true
            }
        })
        console.info(data_lookup)
        res.status(201).json({lookup_detail : data_lookup, lookup_value : data_lookup.value})
    } catch (error) {
        res.status(500).json({message : error})
    }
}