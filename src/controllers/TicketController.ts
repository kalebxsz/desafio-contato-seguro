import { TicketService } from "../services/TicketService";


export class TicketController {
    private ticketService = new TicketService();

    create = async (req: Request, res: Response) => {
        try {
        const { title, description, channel, userId } = req.body;

            if (!title || !description || !channel || !userId){
                return res.status(400).json({
                    message:"Todos os campos são obrigatórios"
                })
            }

        const ticket = await this.ticketService.create(
            title, description, channel, Number(userId))

        return res.status(201).json(ticket)
    }catch(error: any){
        if(error.message === "USER_NOT_FOUND"){
            return res.status(404).json({
                message: "Usuário nao encontrado"
            })
        }
        return res.status(500).json({message: "Erro interno no servidor"})
    }
    }

    findAll = async (req: Request, res: Response) => {
        const tickets = await this.ticketService.findAll()

        return res.status(200).json(tickets)
    }

    findById = async (req: Request, res: Response) => {

    }

    updateStatus = async (req: Request, res: Response) => {

    }

}