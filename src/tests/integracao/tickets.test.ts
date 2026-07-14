import request from "supertest";
import app from "../../app";
import prisma from "../../lib/prisma";

describe("Ticket Integration", () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    const generateUniqueEmail = () => `kaleb+${Date.now()}${Math.floor(Math.random() * 1000)}@email.com`

    test("deve criar um ticket com sucesso", async () => {
        const user = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: generateUniqueEmail(),
                password: "123456"
            })

        const response = await request(app)
            .post("/tickets")
            .send({
                title: "Erro no login",
                description: "Estou recebendo erro ao acessar o sistema",
                userId: user.body.id
            })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body.title).toBe("Erro no login")
        expect(response.body.userId).toBe(user.body.id)
    })

    test("deve retornar 404 quando o usuário não existir", async () => {
        const response = await request(app)
            .post("/tickets")
            .send({
                title: "Erro",
                description: "Erro ao acessar",
                userId: 999999 
            })

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Usuário nao encontrado")
    })

    test("deve retornar 400 quando campos obrigatórios não forem enviados", async () => {
        const response = await request(app)
            .post("/tickets")
            .send({
                title: "Erro"
            })

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Todos os campos são obrigatórios")
    })

    test("deve listar todos os tickets", async () => {
        const user = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: generateUniqueEmail(),
                password: "123456"
            })

        await request(app)
            .post("/tickets")
            .send({
                title: "Erro no login",
                description: "Estou recebendo erro ao acessar o sistema",
                userId: user.body.id
            })

        const response = await request(app)
            .get("/tickets")

        expect(response.status).toBe(200)
       
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        
        const ticketCriado = response.body.find((t: any) => t.userId === user.body.id)
        expect(ticketCriado).toBeDefined();
        expect(ticketCriado.title).toBe("Erro no login")
        expect(ticketCriado.user.name).toBe("Kaleb")
    });

    test("deve buscar um ticket pelo id", async () => {
        const userEmail = generateUniqueEmail()
        const user = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: userEmail,
                password: "123456"
            })

        const createdTicket = await request(app)
            .post("/tickets")
            .send({
                title: "Erro no login",
                description: "Estou recebendo erro ao acessar o sistema",
                userId: user.body.id
            })

        const response = await request(app)
            .get(`/tickets/${createdTicket.body.id}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdTicket.body.id)
        expect(response.body.title).toBe("Erro no login")
        expect(response.body.user.email).toBe(userEmail)
    })

    test("deve retornar 404 quando o ticket não existir", async () => {
        const response = await request(app)
            .get("/tickets/999999")

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Ticket não encontrado")
    })

    test("deve atualizar o status de um ticket", async () => {
        const user = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: generateUniqueEmail(),
                password: "123456"
            })

        const ticket = await request(app)
            .post("/tickets")
            .send({
                title: "Erro no login",
                description: "Estou recebendo erro ao acessar o sistema",
                userId: user.body.id
            })

        const response = await request(app)
            .patch(`/tickets/${ticket.body.id}/status`)
            .send({
                status: "EM_ANDAMENTO"
            })

        expect(response.status).toBe(200)
        expect(response.body.status).toBe("EM_ANDAMENTO")
    })

    test("deve retornar 400 quando o status for inválido", async () => {
        const user = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: generateUniqueEmail(),
                password: "123456"
            })

        const ticket = await request(app)
            .post("/tickets")
            .send({
                title: "Erro",
                description: "Erro ao acessar",
                userId: user.body.id
            })

        const response = await request(app)
            .patch(`/tickets/${ticket.body.id}/status`)
            .send({
                status: "STATUS_INVALIDO"
            })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Status inválido.")
    })

    test("deve retornar 400 quando o status não for informado", async () => {
        const user = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: generateUniqueEmail(),
                password: "123456"
            })

        const ticket = await request(app)
            .post("/tickets")
            .send({
                title: "Erro",
                description: "Erro ao acessar",
                userId: user.body.id
            })
        const response = await request(app)
            .patch(`/tickets/${ticket.body.id}/status`)
            .send({});

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("O status é obrigatório.")
    });

    test("deve retornar 400 quando o id for inválido", async () => {
        const response = await request(app)
            .patch("/tickets/abc/status")
            .send({
                status: "EM_ANDAMENTO"
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("ID inválido.")
    })

    test("deve retornar 404 quando o ticket não existir ao atualizar o status", async () => {
        const response = await request(app)
            .patch("/tickets/999999/status")
            .send({
                status: "EM_ANDAMENTO"
            })

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Ticket não encontrado.")
    })
})