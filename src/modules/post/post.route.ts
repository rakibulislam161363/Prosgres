import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/client";

const route = Router();

route.post("/", auth(Role.AUTHOR,Role.USER, Role.ADMIN), postController.createPost);

route.get("/",postController.getAllPost);

route.get("/stats",auth(Role.ADMIN, Role.USER) ,postController.getPostStats);

route.get("/my-posts",auth(Role.AUTHOR,Role.USER, Role.ADMIN),postController.getMyPosts);

route.get("/:postId", postController.getPostById);

route.patch("/:postId", auth(Role.AUTHOR,Role.USER, Role.ADMIN), postController.updatePost); 

route.delete("/:postId", auth(Role.AUTHOR,Role.USER, Role.ADMIN), postController.deletePost);

export const postRoute = route;