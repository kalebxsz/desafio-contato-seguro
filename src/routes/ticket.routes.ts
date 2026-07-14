import { Router } from "express";
import { TicketController } from "../controllers/TicketController";

const router = Router();

const ticketController = new TicketController();

router.post("/", ticketController.create);

router.get("/", ticketController.findAll);

router.get("/:id", ticketController.findById);

router.patch("/:id/status", ticketController.updateStatus);

export default router;