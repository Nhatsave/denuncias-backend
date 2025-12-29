import { Test, TestingModule } from '@nestjs/testing';
import { GestaoService } from './gestao.service';

describe('GestaoService', () => {
  let service: GestaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GestaoService],
    }).compile();

    service = module.get<GestaoService>(GestaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
