import { Canal, Prioridade } from "@prisma/client";
import { TicketClassifier } from "../../utils/TicketClassifier";

describe("TicketClassifier", () => {

    let classifier: TicketClassifier;

    beforeEach(() => {
        classifier = new TicketClassifier();
    });

    test("deve classificar uma denúncia como OUVIDORIA e prioridade ALTA", () => {

        const result = classifier.classify(
            "Gostaria de fazer uma denúncia de fraude na empresa."
        );

        expect(result.channel).toBe(Canal.OUVIDORIA);
        expect(result.priority).toBe(Prioridade.ALTA);
        expect(result.manualReview).toBe(false);

    });


    test("deve classificar erro como SUPORTE_TECNICO e prioridade MEDIA", () => {

        const result = classifier.classify(
            "Estou com erro ao acessar o sistema."
        );

        expect(result.channel).toBe(Canal.SUPORTE_TECNICO);
        expect(result.priority).toBe(Prioridade.MEDIA);
        expect(result.manualReview).toBe(false);

    });
    test("deve classificar atendimento como SAC e prioridade BAIXA", () => {

        const result = classifier.classify(
            "Gostaria de cancelar minha assinatura."
        );

        expect(result.channel).toBe(Canal.SAC);
        expect(result.priority).toBe(Prioridade.BAIXA);
        expect(result.manualReview).toBe(false);

    });

    test("deve classificar pagamento como FINANCEIRO e prioridade MEDIA", () => {

        const result = classifier.classify(
            "Meu pagamento foi realizado duas vezes."
        );

        expect(result.channel).toBe(Canal.FINANCEIRO);
        expect(result.priority).toBe(Prioridade.MEDIA);
        expect(result.manualReview).toBe(false);

    });
    test("deve classificar como FORA_DO_ESCOPO quando nenhuma palavra-chave for encontrada", () => {

        const result = classifier.classify(
            "Gostaria de sugerir uma nova funcionalidade para o sistema."
        );

        expect(result.channel).toBe(Canal.FORA_DO_ESCOPO);

    });
    test("deve marcar manualReview como true para tickets FORA_DO_ESCOPO", () => {

        const result = classifier.classify(
            "Gostaria de sugerir uma nova funcionalidade para o sistema."
        );

        expect(result.manualReview).toBe(true);

    });
    test("deve definir prioridade BAIXA quando nenhuma palavra de prioridade for encontrada", () => {

        const result = classifier.classify(
            "Gostaria de sugerir uma nova funcionalidade para o sistema."
        );

        expect(result.priority).toBe(Prioridade.BAIXA);

    });
});

