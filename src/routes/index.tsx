import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import caneca from "@/assets/caneca.jpg";
import chaveiro from "@/assets/chaveiro.jpg";
import baldinho from "@/assets/baldinho.jpg";

const WHATS = "5512981266819";
const wa = (msg: string) => `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zailu Personalizados — Brindes e lembrancinhas em São José dos Campos" },
      { name: "description", content: "Canecas, taças, chaveiros e baldinhos personalizados para casamentos, festas e empresas. Peça pelo WhatsApp." },
      { property: "og:title", content: "Zailu Personalizados" },
      { property: "og:description", content: "Brindes personalizados feitos com carinho em São José dos Campos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const produtos = [
  { nome: "Canecas personalizadas", desc: "Com nome, foto ou arte do seu evento.", img: caneca },
  { nome: "Chaveiros 3,5cm", desc: "Lembrança perfeita para padrinhos e convidados.", img: chaveiro },
  { nome: "Baldinhos e copos com tampa", desc: "Para festas infantis e pajens.", img: baldinho },
  { nome: "Taças e kits de casamento", desc: "Taças gravadas, kits padrinhos e muito mais.", img: hero },
];

const avaliacoes = [
  { nome: "Simone", txt: "Fiz taças e chaveiros para os padrinhos, canecas pras damas e copinhos com tampa para os pajens. Trabalho maravilhoso!" },
  { nome: "Melissa Braga", txt: "Gostei muito dos baldinhos personalizados, ficaram lindos." },
  { nome: "Elaine Andrade", txt: "Produtos de qualidade, atendimento personalizado e agilidade na entrega. Voltarei a comprar." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-2xl">Zailu <em className="text-primary">Personalizados</em></span>
        <a href={wa("Olá! Vim pelo site e gostaria de um orçamento.")} className="btn-primary">Fazer pedido</a>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary">★ 5,0 · 14 avaliações no Google</p>
          <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">Lembranças que ficam na memória.</h1>
          <p className="mt-5 text-lg text-muted-foreground">Brindes personalizados para casamentos, aniversários e empresas — feitos à mão em São José dos Campos.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={wa("Olá! Gostaria de um orçamento.")} className="btn-primary">Pedir orçamento no WhatsApp</a>
            <a href="https://instagram.com/zailupersonalizados" target="_blank" rel="noreferrer" className="btn-outline">Ver Instagram</a>
          </div>
        </div>
        <img src={hero} alt="Produtos personalizados Zailu" width={1600} height={1008} className="rounded-3xl shadow-soft" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-4xl">Nossos produtos</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {produtos.map((p) => (
            <article key={p.nome} className="overflow-hidden rounded-2xl bg-card shadow-soft">
              <img src={p.img} alt={p.nome} loading="lazy" width={1024} height={1024} className="aspect-square w-full object-cover" />
              <div className="p-5">
                <h3 className="font-display text-xl">{p.nome}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <a href={wa(`Olá! Tenho interesse em: ${p.nome}`)} className="mt-4 inline-block text-sm font-semibold text-primary">Encomendar →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-4xl">Quem comprou, recomenda</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {avaliacoes.map((a) => (
              <blockquote key={a.nome} className="rounded-2xl bg-card p-6 shadow-soft">
                <p className="text-primary">★★★★★</p>
                <p className="mt-3">"{a.txt}"</p>
                <footer className="mt-4 text-sm font-semibold">— {a.nome}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto grid max-w-6xl gap-6 px-6 py-12 text-sm text-muted-foreground md:grid-cols-3">
        <div><p className="font-display text-xl text-foreground">Zailu Personalizados</p><p>Fornecedor de brindes</p></div>
        <div><p>R. Icatu, 1840 - 31 de Março</p><p>São José dos Campos - SP, 12237-010</p></div>
        <div><p>WhatsApp: (12) 98126-6819</p><p>@zailupersonalizados</p></div>
      </footer>
    </div>
  );
}
