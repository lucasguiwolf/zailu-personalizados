import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText, type ModelMessage } from "ai";
import type { ZodType } from "zod";

import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id.ts";

export function createStructuredResponsesCall<T>(
  request: Request | undefined,
  config: { baseURL: string; apiKey: string; model: string },
  messages: ModelMessage[],
  instructions: string,
  schema: ZodType<T>,
  schemaName: string,
) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(request ? getLovableAiGatewayRunId(request) : undefined);
  const provider = createOpenAI({
    baseURL: `${config.baseURL.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1`,
    apiKey: config.apiKey,
    headers: { "Lovable-API-Key": config.apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses(config.model),
    instructions,
    messages,
    ...(request ? { abortSignal: request.signal } : {}),
    output: Output.object({ schema, name: schemaName }),
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return result;
}
