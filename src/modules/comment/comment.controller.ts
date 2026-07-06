import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const payload = req.body;

    const result = await commentService.createComment(authorId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully",
      data: result,
    })
  },
);
const getCommentsByAuthor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const comments = await commentService.getCommentsByAuthor(authorId);

    sendResponse(res,{
      success: true,
      statusCode: httpStatus.OK,
      message: "author comments",
      data: comments
    })
  },
);

const getCommentPostId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {postId} = req.params;

    const result = await commentService.getCommentPostId(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "post id er coment",
      data: result
    })
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {commentId} = req.params;
    const authorId = req.user?.id;
    const payload = req.body;

    const result = await commentService.updateComment(commentId as string, payload, authorId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:"comment updated successful",
      data: result
    });

  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {commentId} = req.params;
    const authorId = req.user?.id;
    
    const result = commentService.deleteComment(commentId as string, authorId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "delete successfull",
      data: null
    })
  },
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {commentId} = req.params;
    const payload  = req.body;

    const result = await commentService.moderateComment(
      commentId as string, payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "motarated update is successfully",
      data: result
    })
  },
);

export const commentController = {
  createComment,
  getCommentsByAuthor,
  getCommentPostId,
  updateComment,
  deleteComment,
  moderateComment
};
