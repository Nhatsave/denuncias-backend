import { Test, TestingModule } from '@nestjs/testing';
import { GestaoController } from './gestao.controller';

describe('GestaoController', () => {
  let controller: GestaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GestaoController],
    }).compile();

    controller = module.get<GestaoController>(GestaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
