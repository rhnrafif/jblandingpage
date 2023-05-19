import Link from "next/link"
import Login from "@/component/Login"
import Image from "next/image"

export default function Home() {
  return (
    <>       
        <main className='min-w-full min-h-screen bg-slate-100 text-black' >
                <div className="w-full h-fit max-w-[980px] flex justify-between items-center mx-auto lg:border-b-2 lg:border-gray-700 lg:py-2">
                    <div className="w-full flex justify-center">
                        <Image src={'/logo.svg'} width={100} height={100} alt="logo" />
                    </div>
                </div>
               <div className="container relative min-h-screen flex gap-5 max-w-[1180px] mx-auto bg-slate-100 mt-2 lg:mt-5 ">
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
