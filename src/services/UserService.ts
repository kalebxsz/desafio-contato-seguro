import prisma from "../lib/prisma";

export class UserService {

    async create(name: string, email: string, password: string) {
        const user = await prisma.user.create({
            data: {
                name, 
                email,
                password
            }
        })
        return user
    }

    async findMany() {
        return await prisma.user.findMany();
    }

    async findById(id: number) {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })
        return user
    }

    async update(id: number, name: string, email: string, password: string) {
        const user = await prisma.user.update({
            where:{
                id
            },
            data:{
                name, email, password
            }
        })
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