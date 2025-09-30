import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma, Trail } from '@prisma/client';
import { ITrailsRepository } from './interfaces/trails-repository.interface';

@Injectable()
export class TrailsRepository implements ITrailsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    limit: number,
    skip: number,
    search?: string,
  ): Promise<Trail[]> {
    const whereClause: Prisma.TrailWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              subtitle: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    return this.prisma.trail.findMany({
      where: whereClause,
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count(search?: string): Promise<number> {
    const whereClause: Prisma.TrailWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              subtitle: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    return this.prisma.trail.count({
      where: whereClause,
    });
  }

  async findOne(id: string): Promise<Trail | null> {
    return this.prisma.trail.findUnique({ where: { id } });
  }

  async findOneBySubtitle(subtitle: string): Promise<Trail | null> {
    return this.prisma.trail.findUnique({ where: { subtitle } });
  }

  async create(data: Prisma.TrailCreateInput): Promise<Trail> {
    return this.prisma.trail.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TrailUpdateInput): Promise<Trail> {
    return this.prisma.trail.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.trail.delete({
      where: {id}
    })
  }
}
