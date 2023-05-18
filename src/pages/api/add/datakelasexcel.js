import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
    try {
       const dataInput = req.body.data;

        if (dataInput.length === 0) {
        return res.status(400).json({ message: 'No data provided' });
        }

        Promise.all(dataInput.map(processData))
            .then(() => {
                res.status(201).json({ message: 'Berhasil input data Lookup' });
            })
            .catch((error) => {
                const errorMessage = error instanceof Error ? error.message : error;
                res.status(400).json({ message: `Gagal Input Kelas, ${errorMessage}`});
            });

        async function processData(e) {
            const jurusan = e.KELAS.split(' ').slice(0, -1).join(' ');
            const j = await prisma.lookup.findFirst({
                where: {
                value: jurusan.toString(),
                is_active: true
                }
            });

            if (!j) {
                throw new Error(`Jurusan Not Found: ${e.KELAS}`);
            }

            await prisma.data_kelas.create({
                data: {
                nama_kelas: e.KELAS,
                jurusan_id: j.id.toString(),
                is_active: true
                }
            });
        }
    } catch (error) {
        res.status(500).json({message : error})
    }
}