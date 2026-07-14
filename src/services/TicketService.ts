import prisma from "../lib/prisma"
import { Canal } from "@prisma/client"

export class TicketService {

    async create(title: string, description: string, channel: Canal, userId: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        const ticket = await prisma.ticket.create({
        data: {
            title,
            description,
            channel,
            userId
            }
         })

        return ticket
    }

    async findAll() {
        const tickets = await prisma.ticket.findMany()

        return tickets
    }

    async findById() {

    }

    async updateStatus() {

    }

}