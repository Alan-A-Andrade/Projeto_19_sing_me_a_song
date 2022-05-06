
describe("usability", () => {

  beforeEach(cy.clearDatabase);

  const ytVideoName = "Lay All Your Love On Me, performed by a vampire | AAAH!BBA";
  const ytVideoLink = "https://www.youtube.com/watch?v=Xvt9vcoyipA";
  const ytLikes = 350;

	it("should add a recommendation in the home page correctly and persist", () => {
		cy.visit("/");

    cy.get('input')
      .first()
      .type(ytVideoName)
    
    cy.get('input')
      .last()
      .type(ytVideoLink)
  
    cy.get('button')
      .click()

    cy.contains(ytVideoName)
        .should('not.be.undefined')
        .should("be.visible")

    cy.reload()

    cy.contains(ytVideoName)
        .should('not.be.undefined')
        .should("be.visible")

    cy.end()
    
	});

  it("should like a video and persist like", () => {

    cy.seedRecommendations()

		cy.visit("/");
    cy.get('article')
      .first()
        .find('svg')
        .first()
        .click();

    cy.contains(`${ytLikes+1}`)
        .should('not.be.undefined')

    cy.reload()
    cy.contains(`${ytLikes+1}`)
        .should('not.be.undefined')
    
    cy.end()
    
	});

  it("should dislike a video and persist dislike", () => {

    cy.seedRecommendations()

		cy.visit("/");
    cy.get('article')
      .first()
        .find('svg')
        .last()
        .click()

    cy.contains(`${ytLikes-1}`)
      .should('not.be.undefined')

    cy.reload()
    cy.contains(`${ytLikes-1}`)
      .should('not.be.undefined')

    cy.end()
    
	});

})