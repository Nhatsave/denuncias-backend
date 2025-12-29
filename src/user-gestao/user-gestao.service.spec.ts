import { Test, TestingModule } from '@nestjs/testing';
import { UserGestaoService } from './user-gestao.service';

describe('UserGestaoService', () => {
  let service: UserGestaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGestaoService],
    }).compile();

    service = module.get<UserGestaoService>(UserGestaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
