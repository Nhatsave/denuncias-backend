import { Test, TestingModule } from '@nestjs/testing';
import { DenunciasController } from './denuncias.controller';

describe('DenunciasController', () => {
  let controller: DenunciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DenunciasController],
    }).compile();

    controller = module.get<DenunciasController>(DenunciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
