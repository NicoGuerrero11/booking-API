import { Router } from "express";
import { register, login } from "./auth.controller";
import { validateBody } from "../../middleware/validate.middleware";
import { RegisterSchema } from "./schemas/RegisterSchema";
import { LoginSchema } from "./schemas/LoginSchema";
const router: Router = Router();

router.post('/register', validateBody(RegisterSchema), register);
router.post('/login', validateBody(LoginSchema), login);

export default router;