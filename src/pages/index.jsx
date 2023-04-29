import Link from "next/link"
import Login from "@/component/Login"

export default function Home() {
  return (
    <>       
        <main className='min-w-full min-h-screen bg-slate-100 text-black' >
                <div className="w-full h-[60px] max-w-[980px] flex justify-between items-center mx-auto lg:border-b-2 lg:border-gray-700">
                    <div className="w-full flex justify-center">
                        <h2 className="text-xl font-medium">Jaya Buana</h2>
                    </div>
                </div>
               <div className="container relative min-h-screen flex gap-5 max-w-[1180px] mx-auto bg-slate-100 mt-5 ">
                    <div className="flex flex-col items-center mx-auto gap-4 md:gap-10">
                        <div className="flex flex-col items-center">
                          <h1 className="text-md md:text-xl">Selamat Datang</h1>
                          <h1 className="text-md md:text-xl">Silahkan Masuk dengan kode akses</h1>
                        </div>
                        <div className="text-black bg-slate-200 mx-auto h-fit shadow-md rounded-md p-3 md:w-[380px] ">
                            <Login />
                        </div>
                    </div>
                </div>
        </main>
        </>
  )
}
