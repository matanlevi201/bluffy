import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaClient, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
