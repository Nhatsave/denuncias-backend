// src/common/geocoding/geocoding.module.ts
import { Module } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';

@Module({
  providers: [GeocodingService],
  exports: [GeocodingService], // ← EXPORTA para outros módulos
})
export class GeocodingModule {}