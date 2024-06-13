import Image from "next/image";
import Header from '@/app/components/header'
import Camera from '@/app/components/Camera'




export default function Home() {
  return (
   <>
   
   <Header/>
   <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
    <Camera/>
    
    </main>
   </>
  );
}
