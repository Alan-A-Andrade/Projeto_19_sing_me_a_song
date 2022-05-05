/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../../app.js';
import { prisma } from '../../database.js';
import {
  newRecommendationFactory,
  recommendationFactory,
  manyRecommendationsFactory
} from '../factories/recommendationFactory';
import { faker } from '@faker-js/faker';

describe('recommendations - test - POST/recommendations', () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  // it('should return 422 given a invalid name type', async () => {
  //   const body = newRecommendationFactory('notStringName');

  //   const response = await supertest(app).post('/recommendations').send(body);

  //   expect(response.status).toBe(422);
  // });

  // it('should return 422 given a request without name', async () => {
  //   const body = newRecommendationFactory('missingName');

  //   const response = await supertest(app).post('/recommendations').send(body);

  //   expect(response.status).toBe(422);
  // });

  // it('should return 422 given a request without link', async () => {
  //   const body = newRecommendationFactory('missingLink');

  //   const response = await supertest(app).post('/recommendations').send(body);

  //   expect(response.status).toBe(422);
  // });

  // it('should return 422 given a invalid link', async () => {
  //   const body = newRecommendationFactory('wrongLink');

  //   const response = await supertest(app).post('/recommendations').send(body);

  //   expect(response.status).toBe(422);
  // });

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

describe('recommendations - test - POST/recommendations/upvote', () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it('should return 200 and increment the counter by 1 ', async () => {
    const recommendation = await recommendationFactory();

    const resultBefore = await prisma.recommendation.findUnique({
      where: {
        id: recommendation.id
      }
    });

    const response = await supertest(app).post(`/recommendations/${recommendation.id}/upvote`).send();

    const resultAfter = await prisma.recommendation.findUnique({
      where: {
        id: recommendation.id
      }
    });

    expect(response.status).toBe(200);
    expect(resultAfter.score - resultBefore.score).toBe(1);
  });
});

describe('recommendations - test - POST/recommendations/downvote', () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it('should return 200 and decrement the counter by 1 ', async () => {
    const recommendation = await recommendationFactory();

    const resultBefore = await prisma.recommendation.findUnique({
      where: {
        id: recommendation.id
      }
    });

    const response = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`).send();

    const resultAfter = await prisma.recommendation.findUnique({
      where: {
        id: recommendation.id
      }
    });

    expect(response.status).toBe(200);
    expect(resultAfter.score - resultBefore.score).toBe(-1);
  });
});

describe('recommendations - test - GET/recommendations/', () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it('should return 200 and persist a valid request', async () => {
    const response = await supertest(app).get('/recommendations');

    expect(response.status).toBe(200);
  });
});

describe('recommendations - test - GET/recommendations/:id', () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it('should return a recommendation given a id', async () => {
    const recommendation = await recommendationFactory();

    const response = await supertest(app).get(`/recommendations/${recommendation.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(recommendation.id);
  });
});

describe('recommendations - test - GET/recommendations/random', () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it('should return a recommendation', async () => {
    await manyRecommendationsFactory();

    const response = await supertest(app).get('/recommendations/random');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});

describe('recommendations - test - GET/recommendations/top/:amount', () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it('should return a list of X recommendations, ordered by score, given X amount', async () => {
    await manyRecommendationsFactory();

    const amount = faker.datatype.number({ min: 2, max: 4 });

    const response = await supertest(app).get(`/recommendations/top/${amount}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(amount);
    expect(response.body[0].score).toBeGreaterThanOrEqual(response.body[1].score);
  });
});

async function disconnect() {
  await prisma.$disconnect();
}

async function truncateTables() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}
