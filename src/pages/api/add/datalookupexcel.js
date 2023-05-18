import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body.data;
        if(dataInput.length != 0){
            const exec = dataInput.map((e) =>
                prisma.lookup.create({
                data: {
                    name : e.NAME.split(' ').join(''),
                    value : e.VALUE,
                    is_active: true,
                },
                })
            );

            Promise.all(exec)
            .then((results) => {
            res.status(201).json({message : `Berhasil input data Lookup`});
            })
            .catch((error) => {
            res.status(400).json({message : 'Failed to store records:', error });
            });
        }
    } catch (error) {
        res.status(500).json({message : error})
    }
}