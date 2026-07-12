import { Router } from "express";
import userRoutes from "./user.routes"


const router = Router();

//rotas de usuários 
router.use("/users", userRoutes);



//rotas de tickets
// router.use("/tickets", ticketRoutes);

export default router;