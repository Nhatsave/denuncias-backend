import { Test, TestingModule } from '@nestjs/testing';
import { UserGestaoController } from './user-gestao.controller';

describe('UserGestaoController', () => {
  let controller: UserGestaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGestaoController],
    }).compile();

    controller = module.get<UserGestaoController>(UserGestaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
