import { PrismaService } from '@app/comman/prisma/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService){}

  async createComment(userId: number , createCommentDto: CreateCommentDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const post = await this.prisma.post.findUnique({ where: { id: createCommentDto.postId } });
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      if (!post) {
        throw new NotFoundException(`Post with ID ${createCommentDto.postId} not found`);
      }

      const comment = await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          user: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: createCommentDto.postId,
            },
          },
        },
      });

      return comment;
    } catch (error) {
      throw error;
    }
  }

  async getCommentById(userId: number, commentId: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      if (!comment) {
        throw new NotFoundException(`Comment with ID ${commentId} not found`);
      }

      const commentOnPost = await this.prisma.comment.findFirst({
        where: {
          id: commentId,
        },
        include: {
          user: {
            select: {
              name: true,
              profileImage: true,
            }
          },
          post: true,
        },
      })
      return commentOnPost
    } catch (error) {
      throw error
    }
  }

  async deleteCommentById(userId: number, commentId: number) {
      const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
      if (!comment || comment.userId!== userId) {
        throw new ForbiddenException(`Access denied`);
      }
      await this.prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
      return { message: `Comment with ID ${commentId} deleted` };
  }
}
