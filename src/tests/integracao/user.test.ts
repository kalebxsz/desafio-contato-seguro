import request from "supertest"
import app from "../../app"
import prisma from "../../lib/prisma"

describe("User Integration", () => {
    afterAll(async () => {
        await prisma.$disconnect()
    });
    const generateUniqueEmail = () => `kaleb+${Date.now()}${Math.floor(Math.random() * 1000)}@email.com`

    test("deve criar um usuário com sucesso", async () => {
        const userEmail = generateUniqueEmail()
        const response = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: userEmail,
                password: "123456"
            })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body.name).toBe("Kaleb")
        expect(response.body.email).toBe(userEmail)
    })

    test("não deve permitir cadastrar dois usuários com o mesmo email", async () => {
        const sharedEmail = generateUniqueEmail()
        await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: sharedEmail,
                password: "123456"
            })
        const response = await request(app)
            .post("/users")
            .send({
                name: "Outro Usuário",
                email: sharedEmail,
                password: "654321"
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Email já cadastrado")
    })

    test("deve retornar 400 quando nome, email ou senha não forem enviados", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                name: "Kaleb"
            });

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Nome, email e senha são obrigatórios")
    });
    
    test("deve listar todos os usuários", async () => {
        const userEmail = generateUniqueEmail()

        await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: userEmail,
                password: "123456"
            })

        const response = await request(app)
            .get("/users")

        expect(response.status).toBe(200)
        expect(response.body.length).toBeGreaterThanOrEqual(1)

        const userCriado = response.body.find((u: any) => u.email === userEmail);
        expect(userCriado).toBeDefined();
        expect(userCriado.name).toBe("Kaleb");
    })

    test("deve buscar um usuário pelo id", async () => {
        const userEmail = generateUniqueEmail()
        const created = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: userEmail,
                password: "123456"
            })

        const response = await request(app)
            .get(`/users/${created.body.id}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(created.body.id)
        expect(response.body.name).toBe("Kaleb")
        expect(response.body.email).toBe(userEmail)
    })

    test("deve retornar 404 quando usuário não existir", async () => {
        const response = await request(app)
            .get("/users/999999")

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Usuário não encontrado")
    })

    test("deve atualizar um usuário", async () => {
        const emailOriginal = generateUniqueEmail()
        const emailAtualizado = generateUniqueEmail()

        const created = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: emailOriginal,
                password: "123456"
            });

        const response = await request(app)
            .put(`/users/${created.body.id}`)
            .send({
                name: "Kaleb Gabriel",
                email: emailAtualizado, // Usa o novo email dinâmico
                password: "654321"
            });

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(created.body.id)
        expect(response.body.name).toBe("Kaleb Gabriel")
        expect(response.body.email).toBe(emailAtualizado)
    });

    test("deve deletar um usuário", async () => {
        const userEmail = generateUniqueEmail()
        const created = await request(app)
            .post("/users")
            .send({
                name: "Kaleb",
                email: userEmail,
                password: "123456"
            })

        const response = await request(app)
            .delete(`/users/${created.body.id}`)

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(created.body.id)

        const search = await request(app)
            .get(`/users/${created.body.id}`)

        expect(search.status).toBe(404)
    })
})