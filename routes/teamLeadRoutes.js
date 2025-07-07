import {Router} from "express";
import {
  createTeamLead,
  getAllTeamLeads,
  updateTeamLead,
  deleteTeamLead,
} from "../controller/teamlead.controller.js";

import { tokenVerify } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const teamLeadRoutes = Router();

teamLeadRoutes.post("/create-teamLead", tokenVerify, authorizeRoles("admin", "manager"), createTeamLead);


teamLeadRoutes.get("/teamLeads", tokenVerify, authorizeRoles("admin", "manager"), getAllTeamLeads);

teamLeadRoutes.patch("/update-teamLead/:id", tokenVerify, authorizeRoles("admin", "manager"), updateTeamLead);


teamLeadRoutes.delete("/delete-teamLead/:id", tokenVerify, authorizeRoles("admin", "manager"), deleteTeamLead);

export {teamLeadRoutes}
