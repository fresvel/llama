import { Router } from "express";
import { import_grades as get_notas } from "../controllers/get_notas.js";
const router=new Router();

router.get('/logros/table', get_notas)

//router.post('/logros/gemini', logros_eval)




export default router