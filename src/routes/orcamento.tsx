import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { gerarOrcamento } from "@/lib/orcamento.functions";

const WHATS = "5512981266819";
const wa = (msg: string) => `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;

export const Route = createFileRoute("/orcamento")({
  head: () => ({
    meta: [
      { title: "Orçamento com IA — Zailu Personalizados" },
      { name: "description", content: "Descreva o produto personalizado que você quer e receba na hora uma sugestão de orçamento e uma mensagem de pedido pronta para o WhatsApp." },
      { property: "og:title", content: "Orçamento com IA — Zailu Personalizados" },
      { property: "og:description", content: "Descreva sua ideia e receba uma sugestão de orçamento na hora." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Orcamento,
});

type Resultado = {
  resumo: string;
  faixaPreco: string;
  prazoEstimado: string;
  observacoes: string;
  mensagemPedido: string;
};

function Orcamento() {
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState(10);
  const [ocasiao, setOcasiao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    setResultado(null);
    try {
      const r = await gerarOrcamento({ data: { descricao, quantidade, ocasiao } });
      setResultado(r as Resultado);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setErro(
        msg && !/internal|fetch failed/i.test(msg)
          ? msg
          : "Não foi possível gerar o orçamento agora. Tente novamente em instantes ou chame a gente no WhatsApp.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl">Zailu <em className="text-primary">Personalizados</em></Link>
        <a href={wa("Olá! Vim pelo site e gostaria de um orçamento.")} className="btn-primary">Falar no WhatsApp</a>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Orçamento inteligente</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">Conte sua ideia, a gente calcula.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Descreva o produto personalizado que você imaginou e receba na hora uma sugestão de orçamento e uma mensagem de pedido pronta para enviar no nosso WhatsApp.
        </p>

        <form onSubmit={enviar} className="mt-8 space-y-5 rounded-3xl bg-card p-6 shadow-soft md:p-8">
          <div>
            <label htmlFor="descricao" className="text-sm font-semibold">O que você quer personalizar?</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              minLength={10}
              rows={4}
              placeholder="Ex.: canecas brancas com a foto da turma e o nome de cada padrinho, para o meu casamento"
              className="mt-2 w-full rounded-2xl border border-input bg-background p-4 text-base outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="quantidade" className="text-sm font-semibold">Quantidade</label>
              <input
                id="quantidade"
                type="number"
                min={1}
                max={5000}
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value) || 1)}
                className="mt-2 w-full rounded-2xl border border-input bg-background p-4 text-base outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="ocasiao" className="text-sm font-semibold">Ocasião (opcional)</label>
              <input
                id="ocasiao"
                type="text"
                value={ocasiao}
                onChange={(e) => setOcasiao(e.target.value)}
                maxLength={120}
                placeholder="Ex.: casamento, aniversário, evento da empresa"
                className="mt-2 w-full rounded-2xl border border-input bg-background p-4 text-base outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button type="submit" disabled={carregando} className="btn-primary w-full text-center disabled:opacity-60">
            {carregando ? "Gerando sua sugestão..." : "Gerar sugestão de orçamento ✨"}
          </button>
          <p className="text-center text-xs text-muted-foreground">Sugestão gerada por IA — o valor final é confirmado pela loja.</p>
        </form>

        {erro && (
          <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm">
            {erro}{" "}
            <a className="font-semibold text-primary underline" href={wa("Olá! Gostaria de um orçamento.")}>Chamar no WhatsApp</a>
          </div>
        )}

        {resultado && (
          <div className="mt-8 rounded-3xl bg-card p-6 shadow-soft md:p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">Sua sugestão</p>
            <h2 className="mt-3 font-display text-2xl">{resultado.resumo}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-secondary p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Investimento estimado</p>
                <p className="mt-1 font-display text-2xl">{resultado.faixaPreco}</p>
              </div>
              <div className="rounded-2xl bg-secondary p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prazo estimado</p>
                <p className="mt-1 font-display text-2xl">{resultado.prazoEstimado}</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{resultado.observacoes}</p>
            <div className="mt-5 rounded-2xl border border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mensagem pronta para o WhatsApp</p>
              <p className="mt-2 whitespace-pre-line text-sm">{resultado.mensagemPedido}</p>
            </div>
            <a href={wa(resultado.mensagemPedido)} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full text-center">
              Enviar pedido no WhatsApp →
            </a>
          </div>
        )}
      </section>

      <footer className="mx-auto grid max-w-6xl gap-6 px-6 py-12 text-sm text-muted-foreground md:grid-cols-3">
        <div><p className="font-display text-xl text-foreground">Zailu Personalizados</p><p>Fornecedor de brindes</p></div>
        <div><p>R. Icatu, 1840 - 31 de Março</p><p>São José dos Campos - SP, 12237-010</p></div>
        <div><p>WhatsApp: (12) 98126-6819</p><p>@zailupersonalizados</p></div>
      </footer>
    </div>
  );
}
