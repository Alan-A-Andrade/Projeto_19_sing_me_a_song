// tests/user.test.ts
import supertest from "supertest";
import app from "../../app.js";
import { prisma } from '../../database.js'
import {
  newRecommendationFactory,
  recommendationFactory
} from '../factories/recommendationFactory'

describe("recommendations - test - POST/recommendations", () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it("should return 422 given a invalid name type", async () => {

    const body = newRecommendationFactory('notStringName')

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toBe(422)
  });

  it("should return 422 given a request without name", async () => {

    const body = newRecommendationFactory('missingName')

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toBe(422)
  });

  it("should return 422 given a request without link", async () => {

    const body = newRecommendationFactory('missingLink')

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toBe(422)
  });

  it("should return 422 given a request incorrect link", async () => {

    const body = newRecommendationFactory('wrongLink')

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toBe(422)
  });

  it("should return 201 given a valid request", async () => {

    const body = newRecommendationFactory('correct')

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toBe(422)
  });

});

describe("recommendations - test - GET", () => {
  beforeEach(truncateTables);

  afterAll(disconnect);

  it("should return 200 and persist the user given a request", async () => {

    const response = await supertest(app).get("/recommendations");

    expect(response.status).toBe(200)
  });

});

async function disconnect() {
  await prisma.$disconnect();
}

async function truncateTables() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}