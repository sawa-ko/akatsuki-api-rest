import { Test, TestingModule } from '@nestjs/testing';
import { GeneralGateway } from './general.gateway';

describe('GeneralGateway', () => {
  let gateway: GeneralGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralGateway],
    }).compile();

    gateway = module.get<GeneralGateway>(GeneralGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
