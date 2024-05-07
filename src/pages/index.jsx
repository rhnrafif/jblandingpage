import Link from "next/link"
import Login from "@/component/Login"
import Image from "next/image"
import { poppins } from "../../public/fonts"

export default function Home() {
  return (
    <>       
        <main className='min-w-full min-h-screen bg-slate-100 text-black relative flex justify-center items-start' >
          <div className="w-full h-full absolute z-10 bg-[url('/bg.svg')] bg-cover"></div>
                {/* bg-contain bg-center bg-repeat */}
               <div className={`container relative h-fit w-fit flex gap-5 max-w-[1180px] mx-auto pt-10 lg:pt-5 z-20 ${poppins.className}`}>
                    <div className=" w-[245px] h-[400px] bg-[#F3F3F3] flex flex-col items-center mx-auto gap-3 sm:gap-10 rounded-[45px] py-4 px-3 relative sm:h-[630px] sm:w-[510px] drop-shadow-xl">
                        <div className="w-full flex justify-center">
                            <Image src={'/logo.svg'} width={80} height={80} alt="logo" className="sm:w-[110px] sm:h-[110px]" />
                        </div>
                        <div className="flex flex-col items-center text-[#161F35] sm:gap-1">
                          <h1 className="text-lg font-bold sm:text-3xl">Selamat Datang</h1>
                          <h1 className="text-[11px] font-bold sm:text-2xl">di Portal Ujian SMK Jaya Buana</h1>
                        </div>
                        <p className="text-[10px] italic mt-4 sm:text-xl">Silahkan masuk dengan username</p>
                        <div className="flex flex-col items-center justify-center gap-4 mt-4">
                          <p className="text-xs font-semibold sm:text-xl">Username</p>
                          <Login />
                        </div>
                        <p className="text-[8px] sm:text-xs absolute bottom-7"><span>&copy;</span>Jaya Buana Vocational High School</p>
                    </div>
                </div>
        </main>
        </>
  )
}
