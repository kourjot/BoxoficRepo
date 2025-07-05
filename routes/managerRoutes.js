import { Router } from "express";
import {createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from "../controller/event.controller.js";

const managerRouter = Router();

managerRouter.post("/manager/create-event", authenticate, authorizeRoles("manager"), createEvent);
managerRouter.post("/teamlead/create-event", authenticate, authorizeRoles("teamLead"), createEvent);
