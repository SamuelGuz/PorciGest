import Link from "next/link";
import Image from "next/image";


import ImageCarousel from "./ui/ImageCarousel/ImageCarousel";

export default function Home() {
  return (
    <>
      <header className="max-w-4xl mx-auto py-4 bg-[#EAE7DD] px-4 rounded">
      <div className="flex items-center justify-between">
        <div className="logo flex gap-2 items-center ">
          <Image src="/logo.jpg" alt="logo de porcigest" width={80} height={80} className="bg-primary rounded-full"/>
          <h3 className="text-2xl">Porcigest</h3>
        </div>
        <nav>
          <ul className="flex gap-4 items-center">
            <li className="uppercase"><Link href="/about" className="hover:underline">About us</Link></li>
            <li className="uppercase"><Link href="/login" className="hover:underline">Log in</Link></li>
            <li className="uppercase bg-accent px-2 py-1 rounded font-medium hover:bg-secondary-dark"><Link href="/registro">Sing up</Link></li>
          </ul>
        </nav>
        </div>
      </header>
      <main className="max-w-4xl m-auto mt-8 text-center">
        <h1 className="text-6xl mb-3">Bienvenido a Porcigest</h1>
        <p className="text-lg">Un sistema de gestion para unidades porcinas desarrollado en <strong className="color-primary">C.A.S.A</strong></p>
      </main>
        <div className="rounded overflow-hidden">
          <ImageCarousel />
        </div>
    </>
  );
}
