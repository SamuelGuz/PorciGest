
import Image from "next/image";
import Link from "next/link";

export default function aboutUs() {
  return (
    <>
      <header className="max-w-4xl mx-auto py-4 flex items-center justify-between ">
        <div className="logo flex gap-2 items-center">
          <Image
            src="/logo.jpg"
            alt="logo de porcigest"
            width={80}
            height={80}
            className="bg-primary rounded-full"
          />
          <h3 className="text-2xl">Porcigest</h3>
        </div>
        <nav>
          <ul className="flex gap-4 items-center">
            <li className="uppercase">
              <Link href="/about" className="hover:underline">
                About us
              </Link>
            </li>
            <li className="uppercase">
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
            </li>
            <li className="uppercase bg-secondary px-2 py-1 rounded font-medium hover:bg-secondary-dark">
              <Link href="/registro">Sing up</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <div className="max-w-5xl m-auto mt-8 px-5">
          <h1 className="text-2xl text-center">PorciGest</h1>
        </div>
        <div className="max-w-4xl m-auto mt-8 px-5 text-center">
          <p className="text-lg text-center mt-4">
            PorciGest es una aplicación web diseñada para facilitar la gestión
            de unidades porcinas. Nuestro objetivo es proporcionar a los
            productores y administradores de granjas una herramienta eficiente y
            fácil de usar para optimizar sus operaciones diarias.
          </p>
          <p className="text-lg text-center mt-4">
            Con PorciGest, los usuarios pueden llevar un registro detallado de
            sus cerdos, incluyendo información sobre su crecimiento,
            alimentación, salud y reproducción. La aplicación permite la
            creación de perfiles individuales para cada cerdo, lo que facilita
            el seguimiento de su historial y el monitoreo de su bienestar.
          </p>
          <p className="text-lg text-center mt-4">
            Al realizar esta aplicación estamos dando una solucion a las
            personas que le van a dar utilidad ya que les quedara mejor para
            guardar la informacion agregada.
          </p>
          <img
            src="/cerdo7.jpg"
            alt="Imagen 1"
            className="w-full aspect-[16/9] object-cover object-center rounded-lg mt-6"
          />
        </div>
      </main>
    </>
  );
}
