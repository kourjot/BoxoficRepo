import {Router} from "express";
import { googleAuth , healthCheck} from "../controller/googleAuth.js";
import { createOrganization ,getOrganizations,getOrganizationById ,updateOrganization,softDeleteOrganization } from "../controller/organization.js";
import { tokenVerify } from "../middleware/auth.js";
import {signIn ,login} from "../controller/auth.js";
const router = Router();

router.post("/auth/google",googleAuth )

router.get("/",healthCheck)

router.post("/signup", signIn);

router.post("/login", login);

router.post("/organization/create", tokenVerify, createOrganization);

router.get("/organization/get", tokenVerify, getOrganizations);

router.get("/organization/get/:id", tokenVerify, getOrganizationById);

router.patch("/organization/update/:id", tokenVerify, updateOrganization);

router.delete("/organization/delete/:id", tokenVerify, softDeleteOrganization);

export {router}










