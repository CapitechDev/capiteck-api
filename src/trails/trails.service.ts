import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TrailsRepository } from './trails.repository';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';

@Injectable()
export class TrailsService {
  constructor(
    private readonly trailsRepository: TrailsRepository,
  ) {}

  async findAll(limit: number, skip: number, search?: string) {
    const [trails, total] = await Promise.all([
      this.trailsRepository.findAll(limit, skip, search),
      this.trailsRepository.count(search),
    ]);

    return {
      data: trails,
      meta: {
        total: total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    };
  }

  async findOneById(id: string) {
    const trail = await this.trailsRepository.findOne(id);
    if (!trail) throw new NotFoundException('Trilha não encontrada.');
    return trail;
  }

  async create(data: CreateTrailDto) {
    const trailExists = await this.findOneBySubtitle(data.subtitle);
    if (trailExists)
      throw new BadRequestException('Trilha já cadastrada com esse subtítulo.');
    
    return this.trailsRepository.create(data);
  }

  async findOneBySubtitle(subtitle: string) {
    return this.trailsRepository.findOneBySubtitle(subtitle);
  }

  async update(id: string, data: UpdateTrailDto) {
    await this.findOneById(id);

    return this.trailsRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findOneById(id);
    await this.trailsRepository.delete(id);
  }
}
