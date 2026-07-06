import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";

const route = Router();

route.post("/", auth(Role.AUTHOR, Role.USER, Role.ADMIN), commentController.createComment);

route.get("/author/:authorId", commentController.getCommentsByAuthor);

route.get("/:postId", commentController.getCommentPostId);

route.patch("/:commentId", auth(Role.AUTHOR, Role.USER, Role.ADMIN), commentController.updateComment);


route.delete("/:commentId", auth(Role.AUTHOR, Role.USER, Role.ADMIN), commentController.deleteComment);


route.put("/:commentId/moderate", auth(Role.ADMIN), commentController.moderateComment);

export const commentRoute = route;