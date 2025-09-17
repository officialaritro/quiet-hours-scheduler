import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/study-blocks/index';
import { connectToTestDb, clearTestDb, disconnectFromTestDb } from '../utils/testHelpers';

describe('/api/study-blocks', () => {
  beforeAll(async () => {
    await connectToTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectFromTestDb();
  });

  it('should create a new study block', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'authorization': 'Bearer mock-token'
      },
      body: {
        title: 'Math Study',
        date: '2024-12-01',
        startTime: '14:00',
        endTime: '16:00'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.studyBlock.title).toBe('Math Study');
  });
});