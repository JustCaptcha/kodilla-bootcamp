import { Test, TestingModule } from '@nestjs/testing';
import { OrdersDataService } from './orders-data.service';

describe('OrdersService', () => {
  let service: OrdersDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersDataService],
    }).compile();

    service = module.get<OrdersDataService>(OrdersDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
