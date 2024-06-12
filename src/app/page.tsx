import Image from "next/image";
import Header from '@/app/components/header'
import CameraInfo from '@/app/components/camerainfo'
import Camera from '@/app/components/camera'



export default function Home() {
  return (
   <>
   
   <Header/>
   <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
     <Camera/>
     <CameraInfo/>
    </main>
   </>
  );
}
