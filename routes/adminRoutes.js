import {Router} from "express";
import { createManager, getAllManagers ,updateManager ,deleteManager} from "../controller/admin.controller.js";

import {tokenVerify} from "../middleware/auth.js";
import {authorizeRoles} from "../middleware/authorizeRoles.js";

const adminRouter = Router();

adminRouter.post("/create-manager", tokenVerify, authorizeRoles("admin"), createManager);
adminRouter.get("/managers", tokenVerify, authorizeRoles("admin"), getAllManagers);
adminRouter.patch("/update-manager/:id", tokenVerify, authorizeRoles("admin"), updateManager);

adminRouter.delete("/delete-manager/:id", tokenVerify, authorizeRoles("admin"), deleteManager);


export {adminRouter};
