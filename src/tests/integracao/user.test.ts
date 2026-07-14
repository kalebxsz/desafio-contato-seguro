import request from "supertest";
import app from "../../app";
import prisma from "../../lib/prisma";

describe("User Integration", () => {

    beforeEach(async () => {
        await prisma.ticket.deleteMany()
        await prisma.user.deleteMany()
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

test("deve criar um usuário com sucesso", async () => {

    const response = await request(app)
        .post("/users")
        .send({
            name: "Kaleb",
            email: "kaleb@email.com",
            password: "123456"
        });

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Kaleb");
    expect(response.body.email).toBe("kaleb@email.com");

});

test("não deve permitir cadastrar dois usuários com o mesmo email", async () => {

    await request(app)
        .post("/users")
        .send({
            name: "Kaleb",
            email: "kaleb@email.com",
            password: "123456"
        });

    const response = await request(app)
        .post("/users")
        .send({
            name: "Outro Usuário",
            email: "kaleb@email.com",
            password: "654321"
        });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email já cadastrado");

});
test("deve retornar 400 quando nome, email ou senha não forem enviados", async () => {

    const response = await request(app)
        .post("/users")
        .send({
            name: "Kaleb"
        });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
        "Nome, email e senha são obrigatórios"
    );

});
test("deve listar todos os usuários", async () => {

    await request(app)
        .post("/users")
        .send({
            name: "Kaleb",
            email: "kaleb@email.com",
            password: "123456"
        });

    const response = await request(app)
        .get("/users");

    expect(response.status).toBe(200);

    expect(response.body).toHaveLength(1);

    expect(response.body[0].name).toBe("Kaleb");

});
test("deve buscar um usuário pelo id", async () => {

    const created = await request(app)
        .post("/users")
        .send({
            name: "Kaleb",
            email: "kaleb@email.com",
            password: "123456"
        });

    const response = await request(app)
        .get(`/users/${created.body.id}`);

    expect(response.status).toBe(200);

    expect(response.body.id).toBe(created.body.id);
    expect(response.body.name).toBe("Kaleb");
    expect(response.body.email).toBe("kaleb@email.com");

});
test("deve retornar 404 quando usuário não existir", async () => {

    const response = await request(app)
        .get("/users/999");

    expect(response.status).toBe(404);

    expect(response.body.message)
        .toBe("Usuário não encontrado");

});
test("deve atualizar um usuário", async () => {

    const created = await request(app)
        .post("/users")
        .send({
            name: "Kaleb",
            email: "kaleb@email.com",
            password: "123456"
        });

    const response = await request(app)
        .put(`/users/${created.body.id}`)
        .send({
            name: "Kaleb Gabriel",
            email: "gabriel@email.com",
            password: "654321"
        });

    expect(response.status).toBe(200);

    expect(response.body.id).toBe(created.body.id);
    expect(response.body.name).toBe("Kaleb Gabriel");
    expect(response.body.email).toBe("gabriel@email.com");

});
test("deve deletar um usuário", async () => {

    const created = await request(app)
        .post("/users")
        .send({
            name: "Kaleb",
            email: "kaleb@email.com",
            password: "123456"
        });

    const response = await request(app)
        .delete(`/users/${created.body.id}`);

    expect(response.status).toBe(200);

    expect(response.body.id).toBe(created.body.id);

    const search = await request(app)
        .get(`/users/${created.body.id}`);

    expect(search.status).toBe(404);

});
});