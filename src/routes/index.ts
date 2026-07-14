import { Router } from "express";
import userRoutes from "./user.routes"


const router = Router();



router.get('/', (req, res)=>{
    res.status(200).json({
        message: "Api ativa e funcionando corretamente!",
        date: new Date().toISOString()
    })
})
//rotas de usuários 
router.use("/users", userRoutes);



//rotas de tickets
// router.use("/tickets", ticketRoutes);

export default router;