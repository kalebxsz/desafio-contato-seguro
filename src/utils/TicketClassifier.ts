import { Canal, Prioridade } from "@prisma/client";

export class TicketClassifier {
    private readonly channelKeywords = {
        OUVIDORIA: [
            "denúncia",
            "assedio",
            "assédio",
            "fraude",
            "corrupção",
            "conduta ética",
            "ética"
        ],

        SAC: [
            "assinatura",
            "cancelamento",
            "entrega",
            "atendimento"
        ],

        SUPORTE_TECNICO: [
            "erro",
            "acesso",
            "bug",
            "falha",
            "instabilidade",
            "problema"
        ],

        FINANCEIRO: [
            "cobrança",
            "pagamento",
            "reembolso"
        ]
    }
    private readonly priorityKeywords = {
        ALTA: [
            "denúncia",
            "assedio",
            "assédio",
            "fraude"
        ],

        MEDIA: [
            "erro",
            "acesso",
            "cobrança",
            "pagamento"
        ]
    }
    classify(description: string) {

        const normalizedDescription = description.toLowerCase();
        const channel = this.classifyChannel(normalizedDescription);
        const priority = this.classifyPriority(normalizedDescription);
        const manualReview = this.needsManualReview(channel);
        return { channel, priority, manualReview };
    }

    private classifyChannel(description: string): Canal {
        for (const channel in this.channelKeywords) {
            const keywords =
                this.channelKeywords[channel as keyof typeof this.channelKeywords];
            for (const keyword of keywords) {
                if (description.includes(keyword)) {
                    return channel as Canal;
                }
            }
        }
        return Canal.FORA_DO_ESCOPO
    }

    private classifyPriority(description: string): Prioridade {
        for (const keyword of this.priorityKeywords.ALTA) {
            if (description.includes(keyword)) {
                return Prioridade.ALTA
            }
        }
        for (const keyword of this.priorityKeywords.MEDIA) {
            if (description.includes(keyword)) {
                return Prioridade.MEDIA
            }
        }
        return Prioridade.BAIXA;
    }
    private needsManualReview(channel: Canal): boolean {
        return channel === Canal.FORA_DO_ESCOPO
    }

}

