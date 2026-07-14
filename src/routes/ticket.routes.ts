import { Router } from "express";
import { TicketController } from "../controllers/Ticket.controller";

const router = Router();

const ticketController = new TicketController();

router.post("/", ticketController.create);

router.get("/", ticketController.findAll);

router.get("/:id", ticketController.findById);

router.put("/:id/status", ticketController.updateStatus);

export default router;