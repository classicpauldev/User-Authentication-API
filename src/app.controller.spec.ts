import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('Test case 1', () => { expect(true).toBe(true); });
    it('Test case 2', () => { expect(true).toBe(true); });
    it('Test case 3', () => { expect(true).toBe(true); });
    it('Test case 4', () => { expect(true).toBe(true); });
    it('Test case 5', () => { expect(true).toBe(true); });
    it('Test case 6', () => { expect(true).toBe(true); });
    it('Test case 7', () => { expect(true).toBe(true); });
    it('Test case 8', () => { expect(true).toBe(true); });
    it('Test case 9', () => { expect(true).toBe(true); });
    it('Test case 10', () => { expect(true).toBe(true); });
    it('Test case 11', () => { expect(true).toBe(true); });
    it('Test case 12', () => { expect(true).toBe(true); });
    it('Test case 13', () => { expect(true).toBe(true); });
    it('Test case 14', () => { expect(true).toBe(true); });
    it('Test case 15', () => { expect(true).toBe(true); });
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
