import { prisma } from '../src/database.js';

async function main() {
  await prisma.recommendation.createMany({
    data: [
      {
        name: 'Falamansa - Xote dos Milagres',
        youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        score: 100
      },
      {
        name: 'Chitãozinho E Xororó - Evidências',
        youtubeLink: 'https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO',
        score: 150
      },
      {
        name: 'Gimme! Gimme! Gimme! (A Man After Midnight), performed by Victor Frankenstein | AAAH!BBA',
        youtubeLink: 'https://www.youtube.com/watch?v=sABdtEaKMYE',
        score: 250
      },
      {
        name: 'SOS, performed by Captain Hook | AAAH!BBA',
        youtubeLink: 'https://www.youtube.com/watch?v=HlBlhQazxx4',
        score: 350
      }
    ],
    skipDuplicates: true
  }
  );
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
