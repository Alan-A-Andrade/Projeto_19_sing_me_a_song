import { prisma } from "../../database";

export async function recommendationFactory() {

  await prisma.recommendation.create({
    data: {
      name: "Falamansa - Xote dos Milagres",
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }
  })

}

type bodyInputType = "correct" | "wrongLink" | "missingName" | "missingLink" | "notStringName"


export async function newRecommendationFactory(setting: bodyInputType) {

  let name, youtubeLink

  switch (setting) {
    case "correct":
      name = "Falamansa - Xote dos Milagres"
      youtubeLink = "https://www.youtube.com/watch?v=chwyjJbcs1Y"
      break

    case "wrongLink":
      name = "Falamansa - Xote dos Milagres"
      youtubeLink = "https://www.yt.com/watch?v=chwyjJbcs1Y"
      break

    case "missingName":
      name = "Falamansa - Xote dos Milagres"
      youtubeLink = ""
      break
    case "missingLink":
      name = ""
      youtubeLink = "https://www.yt.com/watch?v=chwyjJbcs1Y"
      break

    case "notStringName":
      name = 1
      youtubeLink = "https://www.yt.com/watch?v=chwyjJbcs1Y"
      break

    default:
      break;
  }


  return { name, youtubeLink }

}