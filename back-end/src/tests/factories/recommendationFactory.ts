import { prisma } from '../../database';
import { faker } from '@faker-js/faker';
import { Recommendation } from '@prisma/client';

export async function recommendationFactory() {
  const result = await prisma.recommendation.create({
    data: {
      name: 'Falamansa - Xote dos Milagres',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y'
    }
  });

  return result;
}

export function recommendationDataFactory() :Recommendation {
  return {
    id: 1,
    name: faker.name.findName(),
    youtubeLink: faker.internet.url(),
    score: -5
  };
}

export async function recommendationIncrementScore(id:number) {
  await prisma.recommendation.update({
    where: { id },
    data: {
      score: { increment: 1 }
    }
  });
}

export async function recommendationDecreaseScore(id:number) {
  await prisma.recommendation.update({
    where: { id },
    data: {
      score: { decrement: 1 }
    }
  });
}

type bodyInputType = 'correct' | 'wrongLink' | 'missingName' | 'missingLink' | 'notStringName'

export function recommendationBodyFactory(setting: bodyInputType) {
  let name, youtubeLink;

  switch (setting) {
  case 'correct':
    name = 'Falamansa - Xote dos Milagres';
    youtubeLink = 'https://www.youtube.com/watch?v=chwyjJbcs1Y';
    break;

  case 'wrongLink':
    name = 'Falamansa - Xote dos Milagres';
    youtubeLink = 'https://www.yt.com/watch?v=chwyjJbcs1Y';
    break;

  case 'missingName':
    name = 'Falamansa - Xote dos Milagres';
    youtubeLink = '';
    break;
  case 'missingLink':
    name = '';
    youtubeLink = 'https://www.yt.com/watch?v=chwyjJbcs1Y';
    break;

  case 'notStringName':
    name = 1;
    youtubeLink = 'https://www.yt.com/watch?v=chwyjJbcs1Y';
    break;

  default:
    break;
  }

  return { name, youtubeLink };
}

export async function manyRecommendationsFactory() {
  await prisma.recommendation.createMany({
    data: [
      {
        name: 'Falamansa - Xote dos Milagres',
        youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        score: faker.datatype.number(500)
      },
      {
        name: 'Chitãozinho E Xororó - Evidências',
        youtubeLink: 'https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO',
        score: faker.datatype.number(500)
      },
      {
        name: 'Gimme! Gimme! Gimme! (A Man After Midnight), performed by Victor Frankenstein | AAAH!BBA',
        youtubeLink: 'https://www.youtube.com/watch?v=sABdtEaKMYE',
        score: faker.datatype.number(500)
      },
      {
        name: 'SOS, performed by Captain Hook | AAAH!BBA',
        youtubeLink: 'https://www.youtube.com/watch?v=HlBlhQazxx4',
        score: faker.datatype.number(500)
      }
    ],
    skipDuplicates: true
  }
  );
}

export async function nthRecommendationsFactory(number: number) {
  const data = [];
  for (let i = 0; i < number; i++) {
    data.push({
      name: faker.name.findName(),
      youtubeLink: faker.internet.url()
    });
  }

  await prisma.recommendation.createMany({
    data,
    skipDuplicates: true
  }
  );
}
