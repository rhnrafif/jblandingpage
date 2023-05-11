import generateString from "@/component/Helper/generateString";
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
        let dataInput = req.body.data;
        const nama_kelas = dataInput[0].KELAS;
        if(nama_kelas != ""){
            const kelas_id = await prisma.data_kelas.findFirst({
                where : {
                    nama_kelas : nama_kelas,
                    is_active : true
                }
            })

            if(kelas_id != null){
                const exec = dataInput.map((e) =>
                    prisma.data_siswa.create({
                    data: {
                        nama_lengkap: e.NAMA,
                        kelas_id: kelas_id.id.toString(),
                        kode_akses: generateString(6),
                        is_active: true,
                    },
                    })
                );

                Promise.all(exec)
                .then((results) => {
                res.status(201).json({message : `Berhasil input data ${nama_kelas} sebanyak ${results.length} records`});
                })
                .catch((error) => {
                res.status(400).json({message : 'Failed to store records:', error });
                });
            }
        }
    } catch (error) {
        res.status(500).json({message : error})
    }
}