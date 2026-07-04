import { prisma } from "../../lib/prisma"

const createComment = async (authorId: string, payload: any) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    });

    const result = await prisma.comment.create({
        data: {
            ...payload,
            authorId
        }
    })

    return result;
    
};

const getCommentsByAuthor = async (authorId: string) =>{
    const comments = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            content: "desc"
        },
        include: {
            post:{ 
                select: {
                    id: true,
                    title: true
                }
            }
        }
    });
    return comments;
};

const getCommentById = async (postId : string) => {
    const result = await prisma.comment.findMany({
        where: {
            postId
        }
    })


    return result;

};


const updateComment = async (commentId: string, data:any, authorId: string) => {
 const commentData = await prisma.comment.findFirstOrThrow({
    where:{
        id: commentId,
        authorId
    },
    select: {
        id:true
    }
 })

 const comment = await prisma.comment.update({
    where: {
        id: commentId,
        authorId
    },
    data
 })

 return comment;
};

const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId
        },

        select: {
            id: true
        }
    })

    const comment = prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })


    return comment;
};

const moderateComment = async (id:string, data: any) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id,
        },
        select:{
            id: true,
            status: true
        }
    })

    if(commentData.status === data.status){
        throw new Error(`Your provided status (${data.status}) is alrady up to date`)
    }

    const comment = await prisma.comment.update({
        where: {
            id,
        },
        data
    })


    return comment;
}


export const commentService = {
    createComment,
    getCommentsByAuthor,
    getCommentById,
    updateComment,
    deleteComment,
    moderateComment
}