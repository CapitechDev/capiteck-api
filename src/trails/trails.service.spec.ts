import { Test, TestingModule } from '@nestjs/testing';
import { TrailsService } from './trails.service';
import { TrailsRepository } from './trails.repository';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';
import { Trail } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TrailsService', () => {
  let service: TrailsService;
  let trailsRepository: jest.Mocked<TrailsRepository>;

  const mockTrail: Trail = {
    id: '1',
    name: 'Fundamentos do React',
    subtitle: 'Aprenda o básico do React',
    description: 'Guia completo dos fundamentos do React com exemplos práticos',
    video_title: 'Introdução ao React',
    video_description: 'Este vídeo aborda os fundamentos do React',
    references: 'https://react.dev',
    iframe_references: 'https://codesandbox.io/embed/react-example',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockTrailsRepository = {
      findAll: jest.fn(),
      count: jest.fn(),
      findOne: jest.fn(),
      findOneBySubtitle: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrailsService,
        {
          provide: TrailsRepository,
          useValue: mockTrailsRepository,
        },
      ],
    }).compile();

    service = module.get<TrailsService>(TrailsService);
    trailsRepository = module.get(TrailsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated trails without search', async () => {
      const mockTrails = [mockTrail];
      const total = 1;
      const limit = 10;
      const skip = 0;

      trailsRepository.findAll.mockResolvedValue(mockTrails);
      trailsRepository.count.mockResolvedValue(total);

      const result = await service.findAll(limit, skip);

      expect(trailsRepository.findAll).toHaveBeenCalledWith(
        limit,
        skip,
        undefined,
      );
      expect(trailsRepository.count).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({
        data: mockTrails,
        meta: {
          total,
          limit,
          skip,
          hasMore: false,
        },
      });
    });

    it('should return paginated trails with search', async () => {
      const mockTrails = [mockTrail];
      const total = 1;
      const limit = 10;
      const skip = 0;
      const search = 'React';

      trailsRepository.findAll.mockResolvedValue(mockTrails);
      trailsRepository.count.mockResolvedValue(total);

      const result = await service.findAll(limit, skip, search);

      expect(trailsRepository.findAll).toHaveBeenCalledWith(
        limit,
        skip,
        search,
      );
      expect(trailsRepository.count).toHaveBeenCalledWith(search);
      expect(result).toEqual({
        data: mockTrails,
        meta: {
          total,
          limit,
          skip,
          hasMore: false,
        },
      });
    });

    it('should return hasMore true when there are more results', async () => {
      const mockTrails = [mockTrail];
      const total = 15;
      const limit = 10;
      const skip = 0;

      trailsRepository.findAll.mockResolvedValue(mockTrails);
      trailsRepository.count.mockResolvedValue(total);

      const result = await service.findAll(limit, skip);

      expect(result.meta.hasMore).toBe(true);
    });
  });

  describe('findOneById', () => {
    it('should return a trail when found', async () => {
      trailsRepository.findOne.mockResolvedValue(mockTrail);

      const result = await service.findOneById('1');

      expect(trailsRepository.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTrail);
    });

    it('should throw NotFoundException when trail not found', async () => {
      trailsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById('1')).rejects.toThrow(NotFoundException);
      expect(trailsRepository.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a trail successfully', async () => {
      const createTrailDto: CreateTrailDto = {
        name: 'Fundamentos do React',
        subtitle: 'Aprenda o básico do React',
        description:
          'Guia completo dos fundamentos do React com exemplos práticos',
        video_title: 'Introdução ao React',
        video_description: 'Este vídeo aborda os fundamentos do React',
        references: 'https://react.dev',
        iframe_references: 'https://codesandbox.io/embed/react-example',
      };

      trailsRepository.findOneBySubtitle.mockResolvedValue(null);
      trailsRepository.create.mockResolvedValue(mockTrail);

      const result = await service.create(createTrailDto);

      expect(trailsRepository.findOneBySubtitle).toHaveBeenCalledWith(
        createTrailDto.subtitle,
      );
      expect(trailsRepository.create).toHaveBeenCalledWith(createTrailDto);
      expect(result).toEqual(mockTrail);
    });

    it('should throw BadRequestException when trail with subtitle already exists', async () => {
      const createTrailDto: CreateTrailDto = {
        name: 'Fundamentos do React',
        subtitle: 'Aprenda o básico do React',
        description:
          'Guia completo dos fundamentos do React com exemplos práticos',
      };

      trailsRepository.findOneBySubtitle.mockResolvedValue(mockTrail);

      await expect(service.create(createTrailDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(trailsRepository.findOneBySubtitle).toHaveBeenCalledWith(
        createTrailDto.subtitle,
      );
      expect(trailsRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findOneBySubtitle', () => {
    it('should return a trail when found by subtitle', async () => {
      trailsRepository.findOneBySubtitle.mockResolvedValue(mockTrail);

      const result = await service.findOneBySubtitle(
        'Aprenda o básico do React',
      );

      expect(trailsRepository.findOneBySubtitle).toHaveBeenCalledWith(
        'Aprenda o básico do React',
      );
      expect(result).toEqual(mockTrail);
    });

    it('should return null when trail not found by subtitle', async () => {
      trailsRepository.findOneBySubtitle.mockResolvedValue(null);

      const result = await service.findOneBySubtitle('Non-existent subtitle');

      expect(trailsRepository.findOneBySubtitle).toHaveBeenCalledWith(
        'Non-existent subtitle',
      );
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a trail successfully', async () => {
      const updateTrailDto: UpdateTrailDto = {
        name: 'Fundamentos do React Atualizado',
      };

      const updatedTrail = {
        ...mockTrail,
        name: 'Fundamentos do React Atualizado',
      };

      trailsRepository.findOne.mockResolvedValue(mockTrail);
      trailsRepository.update.mockResolvedValue(updatedTrail);

      const result = await service.update('1', updateTrailDto);

      expect(trailsRepository.findOne).toHaveBeenCalledWith('1');
      expect(trailsRepository.update).toHaveBeenCalledWith('1', updateTrailDto);
      expect(result).toEqual(updatedTrail);
    });

    it('should throw NotFoundException when updating non-existent trail', async () => {
      const updateTrailDto: UpdateTrailDto = {
        name: 'Fundamentos do React Atualizado',
      };

      trailsRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', updateTrailDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(trailsRepository.findOne).toHaveBeenCalledWith('1');
      expect(trailsRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a trail successfully', async () => {
      trailsRepository.findOne.mockResolvedValue(mockTrail);
      trailsRepository.delete.mockResolvedValue(undefined);

      await expect(service.delete('1')).resolves.toBeUndefined();

      expect(trailsRepository.findOne).toHaveBeenCalledWith('1');
      expect(trailsRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when deleting non-existent trail', async () => {
      trailsRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
      expect(trailsRepository.findOne).toHaveBeenCalledWith('1');
      expect(trailsRepository.delete).not.toHaveBeenCalled();
    });
  });
});
