import { prisma } from "../src/database.js"

async function main() {

  await prisma.recommendation.createMany({
    data: [
      {
        name: "Falamansa - Xote dos Milagres",
        youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
      }
    ],
    skipDuplicates: true
  }

  )

}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });