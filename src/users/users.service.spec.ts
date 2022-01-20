import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let mockExec: jest.Mock;
  let mockFindOne: jest.Mock;
  let mockFindById: jest.Mock;

  beforeEach(async () => {
    mockExec = jest.fn();
    mockFindOne = jest.fn().mockReturnValue({ exec: mockExec });
    mockFindById = jest.fn().mockReturnValue({ exec: mockExec });

    const mockUserModel = {
      findOne: mockFindOne,
      findById: mockFindById,
      prototype: {},
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const user = { email: 'test@example.com', password: 'hashed' };
      mockExec.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
    });
  });
});
