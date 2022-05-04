/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../../app.js';
import { prisma } from '../../database.js';
import {
  newRecommendationFactory
} from '../factories/recommendationFactory';

describe('recommendations - test - POST/recommendations', () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it('should return 422 given a invalid name type', async () => {
    const body = newRecommendationFactory('notStringName');

    const response = await supertest(app).post('/recommendations').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 422 given a request without name', async () => {
    const body = newRecommendationFactory('missingName');

    const response = await supertest(app).post('/recommendations').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 422 given a request without link', async () => {
    const body = newRecommendationFactory('missingLink');

    const response = await supertest(app).post('/recommendations').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 422 given a invalid link', async () => {
    const body = newRecommendationFactory('wrongLink');

    const response = await supertest(app).post('/recommendations').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 201 and persist given a valid request', async () => {
    const body = newRecommendationFactory('correct');

    const response = await supertest(app).post('/recommendations').send(body);

    const result = await prisma.recommendation.findUnique({
      where: {
        name: body.name
      }
    });

    expect(response.status).toBe(201);
    expect(result.youtubeLink).toBe(body.youtubeLink);
  });
});

describe('recommendations - test - GET', () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it('should return 200 and persist a valid request', async () => {
    const response = await supertest(app).get('/recommendations');

    expect(response.status).toBe(200);
  });
});

async function disconnect() {
  await prisma.$disconnect();
}

async function truncateTables() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}
