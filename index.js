import "dotenv/config"
import express  from "express";
import sdg_router from "./routes/sdg_router.js";


const app = express();
const PORT=process.env.PORT ||3000
app.use(express.json());

app.use("/sdg/v1/",sdg_router)

app.use(express.static("public"));

app.listen(PORT, ()=>{
  console.log(`Servidor iniciado en :http://localhost:${PORT}/sdg/v1/logros/eval`)
});



