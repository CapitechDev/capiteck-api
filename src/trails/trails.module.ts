import { Module } from '@nestjs/common';
import { TrailsController } from './trails.controller';
import { TrailsService } from './trails.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TrailsRepository } from './trails.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TrailsController],
  providers: [TrailsService, TrailsRepository]
})
export class TrailsModule {}
