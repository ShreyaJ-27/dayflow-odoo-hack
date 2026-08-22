import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('health and public metadata', () => {
  it('reports a connected database', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, status: 'ok', database: 'connected' });
  });

  it('returns API metadata without authentication', async () => {
    const response = await request(app).get('/api/info');
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('Dayflow HRMS API');
  });
});
