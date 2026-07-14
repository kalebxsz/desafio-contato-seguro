import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    private userService = new UserService();
    
    // criar usuario
    create = async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Nome, email e senha são obrigatórios"
                });
            }
            const user = await this.userService.create(
                name,
                email,
                password
            )
            return res.status(201).json(user);

        } catch (error: any) {
            if (error.message === "EMAIL_ALREADY_EXISTS") {
                return res.status(409).json({
                    message: "Email já cadastrado"
                });
            }
            return res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    // buscar usuarios 
    findAll = async (req: Request, res: Response)=> {
        try {
            const users = await this.userService.findMany();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    // buscar um usuario por id
    findById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const user = await this.userService.findById(id);
            return res.status(200).json(user);
        } catch (error: any) {
            // Captura o erro lançado pelo UserService e devolve 404
            if (error.message === "USER_NOT_FOUND") {
                return res.status(404).json({
                    message: "Usuário não encontrado" // Exatamente o que o seu teste espera!
                });
            }
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    // atualizar um usuário 
    update = async (req: Request, res: Response)=> {
        try {
            const id = Number(req.params.id)
            const {name, email, password} = req.body

            const user = await this.userService.update(id, name, email, password)
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    // deletar um usuario
    delete = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id)
            const user = await this.userService.delete(id)
            return res.status(200).json(user)
        } catch (error: any) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}