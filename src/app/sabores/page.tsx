import BackButton from "@/components/ui/SaboresPage/backButton"
import PacoCard from "@/components/ui/SaboresPage/pacoCard"
import { getPaquitos } from "@/lib/directus/queries"

export const revalidate = 30;

export default async function Sabores() {
  const paquitos = await getPaquitos();

  return (
    <>
      <section className="padding-responsive pt-22 md:pt-25 pb-10">
        <BackButton />
        <h1 className="mt-5 md:text-center font-chunko uppercase text-paco-orange text-4xl md:text-7xl lg:text-8xl">
          Todos nuestros sabores
        </h1>
        <h2 className="mt-4 md:text-center font-now uppercase text-xl md:text-3xl lg:text-4xl">
          ¡Cuidado! Querrás repetir
        </h2>
      </section>

      <section className="padding-responsive gap-10 flex flex-col pb-24">
        {paquitos.map((paquito, i) => (
          <PacoCard key={paquito.id} paquito={paquito} reverse={i % 2 === 1} />
        ))}
      </section>
    </>
  )
}