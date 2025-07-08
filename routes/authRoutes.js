import {Router} from "express";
import { googleLogin} from "../controller/googleAuth.js";
import { createOrganization ,getOrganizations,getOrganizationById ,updateOrganization,softDeleteOrganization } from "../controller/organization.js";
import { tokenVerify } from "../middleware/auth.js";
import {signIn ,login,getUserById} from "../controller/auth.js";

import { updateManager } from "../controller/admin.controller.js";


const router = Router();

router.post("/auth/google",googleLogin )


router.post("/signup", signIn);



router.post("/login", login);

router.get("/user/:id", tokenVerify, getUserById);

router.post("/organization/create", tokenVerify, createOrganization);

router.get("/organization/get", tokenVerify, getOrganizations);

router.get("/organization/get/:id", tokenVerify, getOrganizationById);

router.patch("/organization/update/:id", tokenVerify, updateOrganization);

router.delete("/organization/delete/:id", tokenVerify, softDeleteOrganization);


router.patch("/user-update/:id", tokenVerify, updateManager);
export {router}










