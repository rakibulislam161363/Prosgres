import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import { userRoute } from "./modules/user/user.route";


const app: Application = express();

app.use(cors({
    origin: config.appUrl,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", async (req, res) => {
    const user =  await prisma.user.findMany();
    console.log(user)
    res.send("Hello, World!");
});

app.use("/api/users/", userRoute);

export default app;