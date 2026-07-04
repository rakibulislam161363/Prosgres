import { CommentStatus, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPost = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const getPostById = async (postId: string) => {
  const transaction = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const post = await tx.post.findFirstOrThrow({
      where: {
        id: postId,
      },

      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });

  return transaction;
  // const result = await prisma.post.
  //findUniqueOrThrow({
  //     where: {
  //         id: postId
  //     },
  // })
  // const updatePost = await prisma.post.update({
  //     where: {
  //         id: postId
  //     },
  //     data: {
  //         views: {
  //             increment: 1
  //         }
  //     },
  //     include: {
  //         author: {
  //             omit: {
  //                 password: true,
  //             }
  //         },
  //         comments: true
  //     }
  // })
  // return updatePost;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to delete this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getPostStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {

    const [totalPosts, totalPublishedPosts, totalDraftPosts, totalArchivedPosts, totalComments, totalApprovedComments, totalRejectedComments, totalViewsAggregate] = await Promise.all([
        await tx.post.count(),
        await tx.post.count({
      where: {
        status: PostStatus.PUBLISHED,
      },
    }),

    await tx.post.count({
      where: {
        status: PostStatus.DRAFT,
      },
    }),
    await tx.post.count({
      where: {
        status: PostStatus.ARCHIVED,
      },
    }),

     await tx.comment.count(),
    await tx.comment.count({
      where: {
        status: CommentStatus.APPROVED,
      },
    }),
    await tx.comment.count({
      where: {
        status: CommentStatus.REJECTED,
      },
    }),

    await tx.post.aggregate({
        _sum: {
            views: true,
        }
    }),
    ]);

    return {
        totalPosts,
        totalPublishedPosts,
        totalDraftPosts,
        totalArchivedPosts,
        totalComments,
        totalApprovedComments,
        totalRejectedComments,
        totalViews: totalViewsAggregate._sum.views || 0
    }

    // const totalPosts = await tx.post.count();
    // const totalPublilsedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED,
    //   },
    // });

    // const totalDraftPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });
    // const totalArchivedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });

    // const totalCommments = await tx.comment.count();
    // const totalApprovedCommets = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });
    // const totalRejectedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECTED,
    //   },
    // });

    // not a good approach
    // const totalViewsPosts = await tx.post.findMany();

    // let totalViews = 0;

    // totalViewsPosts.forEach((post) => {
    //   totalViews += post.views;
    // });

    // const totalViewsAggregate = await tx.post.aggregate({
    //     _sum: {
    //         views: true,
    //     }
    // });


    // const totalViews = totalViewsAggregate._sum.views || 0;


    // return {
    //   totalPosts,
    //   totalPublilsedPosts,
    //   totalDraftPosts,
    //   totalArchivedPosts,
    //   totalCommments,
    //   totalApprovedCommets,
    //   totalRejectedComments,
    //   totalViews,
    // };
  });

  return transactionResult;
};
export const postService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  getPostStats,
  deletePost,
};
