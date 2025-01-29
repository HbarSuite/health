import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

/**
 * Test suite for HealthService
 * 
 * @description
 * Contains unit tests for verifying the functionality of the HealthService class.
 * Tests cover:
 * - Service instantiation
 * - Basic service functionality
 * 
 * @group Health
 * @category Tests
 */
describe('HealthService', () => {
  /**
   * Instance of HealthService used across test cases
   */
  let service: HealthService;

  /**
   * Set up test environment before each test
   * 
   * @description
   * Creates a test module with HealthService provider and initializes
   * the service instance for testing
   * 
   * @beforeEach
   * @async
   */
  beforeEach(async () => {
    /**
     * Test module configuration and compilation
     */
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    /**
     * Retrieve HealthService instance from test module
     */
    service = module.get<HealthService>(HealthService);
  });

  /**
   * Test case to verify service instantiation
   * 
   * @description
   * Ensures that the HealthService is properly defined and instantiated
   * 
   * @test
   * @category Initialization
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
