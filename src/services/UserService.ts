import prisma from "../lib/prisma";
import bcrypt from 'bcryptjs';

export class UserService {

    async create(name: string, email: string, password: string) {
        try {
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword
                }
            })
            const { password: _, ...userWithoutPassword } = user
            return userWithoutPassword
        }

        catch (error: any) {
            if (error.code === "P2002") {
                throw new Error("EMAIL_ALREADY_EXISTS")
            }
        }
    }
    async findMany() {
        try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })
        return users;

    } catch (error: any) {
        throw new Error("Erro ao buscar usuários: " + error.message);
    }
    }

    async findById(id: number) {
        const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        return user;
    }

    async update(id: number, name: string, email: string, password: string) {
        const user = await prisma.user.update({
            where: {
                id
            },
            data: {
                name, email, password
            }
        })
        if(!user){
            throw new Error("Usuário não encontrado")
        }
        return user
    }

    async delete(id: number) {
        const user = await prisma.user.delete({
            where: {
                id
            }
        })
        return user
    }
}