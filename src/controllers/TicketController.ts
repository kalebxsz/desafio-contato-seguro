import { Request, Response } from "express";
import { TicketService } from "../services/TicketService";
import { Status } from "@prisma/client";

export class TicketController {
    private ticketService = new TicketService();

    create = async (req: Request, res: Response) => {
        try {
            const { title, description, userId } = req.body;
            if (!title || !description || !userId) {
                return res.status(400).json({
                    message: "Todos os campos são obrigatórios"
                })
            }
            
            const ticket = await this.ticketService.create(
                title, description, Number(userId))

            return res.status(201).json(ticket)
        } catch (error: any) {
            if (error.message === "USER_NOT_FOUND") {
                return res.status(404).json({
                    message: "Usuário nao encontrado"
                })
            }
            return res.status(500).json({ message: "Erro interno no servidor" })
        }
    }

    findAll = async (req: Request, res: Response) => {
        const tickets = await this.ticketService.findAll()

        return res.status(200).json(tickets)
    }

    findById = async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const ticket = await this.ticketService.findById(id);
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket não encontrado"
            });
        }
        return res.status(200).json(ticket);
    }

    updateStatus = async (req: Request, res: Response) => {

        try {

            const id = Number(req.params.id);

            const { status } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "ID inválido."
                });
            }

            if (!status) {
                return res.status(400).json({
                    message: "O status é obrigatório."
                });
            }

            if (!Object.values(Status).includes(status)) {
                return res.status(400).json({
                    message: "Status inválido."
                });
            }

            const ticket = await this.ticketService.updateStatus(id, status);

            return res.status(200).json(ticket);

        } catch (error: any) {
            console.error(error)
            if (error.message === "TICKET_NOT_FOUND") {
                return res.status(404).json({
                    message: "Ticket não encontrado."
                });
            }

            return res.status(500).json({
                message: "Erro interno do servidor."
            });

        }

    }

}