import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body;
        const lookup_detail = await prisma.lookup.findFirst({
            where : {
                id : parseInt(dataInput.id),
                is_active : true
            }
        })
        if(lookup_detail.id != 0){
            if(dataInput.name != "Pilih"){
                await prisma.lookup.update({
                    where : {
                        id : lookup_detail.id
                    },
                    data : {
                        name : dataInput.name,
                        value : dataInput.value,
                        is_active : true
                    }   
                })
                .then((e)=>{
                    res.status(201).json({message : "Berhasil Update"})
                })
            }else res.status(400).json({message : "Name or Value cannot be null"})
            
        }else res.status(400).json({message : "Lookup Not Found"})
    } catch (error) {
        res.status(500).json({message : error})
    }
}