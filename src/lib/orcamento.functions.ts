import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  descricao: z.string().trim().min(10, "Descreva o produto com um pouco mais de detalhes.").max(800),
  quantidade: z.number().int().min(1).max(5000),
  ocasiao: z.string().trim().max(120).optional().default(""),
});

const orcamentoSchema = z.object({
  resumo: z.string(),
  faixaPreco: z.string(),
  prazoEstimado: z.string(),
  observacoes: z.string(),
  mensagemPedido: z.string(),
});

const INSTRUCTIONS = `Você é a assistente de orçamentos da Zailu Personalizados, uma loja de brindes e lembrancinhas personalizadas em São José dos Campos - SP (canecas, copos com tampa e canudo, chaveiros, baldinhos, taças, bowls, bottons, bottons espelho, chinelos, ímãs de geladeira, bolas de Natal e kits para casamentos, festas e empresas).

A partir da descrição do cliente, gere uma SUGESTÃO de orçamento realista para o mercado brasileiro de personalizados, em português do Brasil, seguindo exatamente o formato de saída:
- resumo: uma frase curta descrevendo o que será produzido (produto, personalização e quantidade).
- faixaPreco: faixa de preço total estimada em reais, no formato "R$ X a R$ Y" (valores plausíveis; produtos personalizados costumam sair mais baratos por unidade em quantidades maiores).
- prazoEstimado: prazo de produção estimado em dias úteis (ex.: "5 a 7 dias úteis").
- observacoes: 1 a 2 frases com cuidados importantes (ex.: valores sujeitos a confirmação da arte, prazo contado após aprovação, frete/retirada).
- mensagemPedido: mensagem pronta, simpática e objetiva, que o cliente enviará pelo WhatsApp para a loja confirmando o pedido, incluindo produto, quantidade, personalização desejada e a faixa de preço estimada. Não inclua saudações genéricas longas; comece com "Olá! Vim pelo site da Zailu Personalizados".

Seja honesta: deixe claro nas observações que é uma estimativa e que o valor final é confirmado pela loja.`;

export const gerarOrcamento = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("O serviço de orçamento automático não está configurado no momento. Tente novamente mais tarde.");
    }
    const { createStructuredResponsesCall } = await import("./responses.ts");
    const result = createStructuredResponsesCall(
      undefined,
      {
        baseURL: "https://ai.gateway.lovable.dev/v1",
        apiKey,
        model: "openai/gpt-6-astra",
      },
      [
        {
          role: "user",
          content: `Pedido do cliente:\n- Descrição: ${data.descricao}\n- Quantidade: ${data.quantidade} unidade(s)\n- Ocasião: ${data.ocasiao || "não informada"}`,
        },
      ],
      INSTRUCTIONS,
      orcamentoSchema,
      "orcamento",
    );
    const output = await result.output;
    if (!output) {
      throw new Error("Não consegui montar a sugestão de orçamento. Tente descrever o produto de outro jeito.");
    }
    return output;
  });
