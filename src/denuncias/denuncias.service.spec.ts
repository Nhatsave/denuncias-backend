import { Test, TestingModule } from '@nestjs/testing';
import { DenunciasService } from './denuncias.service';

describe('DenunciasService', () => {
  let service: DenunciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DenunciasService],
    }).compile();

    service = module.get<DenunciasService>(DenunciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
