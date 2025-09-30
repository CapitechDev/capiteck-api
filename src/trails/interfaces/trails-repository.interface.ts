import { Prisma, Trail } from '@prisma/client';

export interface ITrailsRepository {
  findAll(limit: number, skip: number, search?: string): Promise<Trail[]>;
  count(search?: string): Promise<number>;
  findOne(id: string): Promise<Trail | null>;
  findOneBySubtitle(subtitle: string): Promise<Trail | null>;
  create(data: Prisma.TrailCreateInput): Promise<Trail>;
  update(id: string, data: Prisma.TrailUpdateInput): Promise<Trail>;
  delete(id: string): Promise<void>;
}
