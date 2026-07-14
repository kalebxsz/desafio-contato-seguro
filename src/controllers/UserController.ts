import { Request, Response } from "express";
import { UserService } from "../services/UserService";


export class UserController {
    private userService = new UserService();
    
    // arrow function para podermos utilizar this
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

    //buscar usuarios 
    findAll = async (req: Request, res: Response)=> {
        const users = await this.userService.findMany();
        if(!users){
            return res.status(404)
        }
        return res.status(200).json(users);
    }
    // busvar um usuario por id
    findById = async (req: Request, res: Response) => {
        const id = Number(req.params.id)
        const user = await this.userService.findById(id)
        if (!user) {
        return res.status(404).json({
            message: "Usuário não encontrado"
        });
    }
        return res.status(200).json(user)
    }

    
    // atualizar um usuário 
    update = async (req: Request, res: Response)=> {
        const id = Number(req.params.id)
        const {name, email, password} = req.body

        const user = await this.userService.update(
            id, name, email, password
        )
        
        return res.status(200).json(user);
    }
    // deletar um usuario
    delete = async (req: Request, res: Response) => {
        const id = Number(req.params.id)
        const user = await this.userService.delete(id)

        return res.status(200).json(user)
    }

}