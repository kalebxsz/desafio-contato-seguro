import prisma from "../lib/prisma"
import { Status } from "@prisma/client";
import { TicketClassifier } from "../utils/TicketClassifier";


export class TicketService {
    private ticketClassifier = new TicketClassifier();

    async create(title: string, description: string, userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        const classification = this.ticketClassifier.classify(description);
        const ticket = await prisma.ticket.create({
        data: {
            title,
            description,
            channel: classification.channel,
            priority: classification.priority,
            manualReview: classification.manualReview,
            userId
            }
         })

        return ticket
    }

    async findAll() {
        const tickets = await prisma.ticket.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        return tickets
    }

    async findById(id: number) {
        const ticket = await prisma.ticket.findUnique({
            where: {
                id
            },
            include: { user: 
                { select: 
                    { 
                        id: true, 
                        name: true, 
                        email: true 
                    }
                }
            }
        })
        return ticket
    }

    async updateStatus(id: number, status: Status) {
        const ticket = await prisma.ticket.findUnique({
            where: {id}
        })
        if(!ticket){
            throw new Error("TICKET_NOT_FOUND")
        }
        const updateTicket = await prisma.ticket.update({
            where: {id},
            data: {status}
        })
        return updateTicket
    }
    

}