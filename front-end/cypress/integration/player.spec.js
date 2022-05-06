describe("Play music", () => {

  beforeEach(cy.seedRecommendations);
  afterEach(cy.clearDatabase);

	it("should display video in the home page correctly", () => {
		cy.visit("/");

    cy.get('article')
      .first()
      .find('iframe')
        .should('be.visible')
        .should('not.be.undefined')
        .end()
    
	});

  it("should display video in the random page correctly", () => {
		cy.visit("/random");

    cy.get('article')
      .first()
      .find('iframe')
        .should('be.visible')
        .should('not.be.undefined')
        .end()
	});

  it("should display video in the top page correctly", () => {
		cy.visit("/top");

    cy.get('article')
      .first()
      .find('iframe')
        .should('be.visible')
        .should('not.be.undefined')
        .end()
	});
  

});