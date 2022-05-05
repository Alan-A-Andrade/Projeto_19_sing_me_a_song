describe("Login", () => {

  beforeEach(cy.clearDatabase);

	it("should login successfully", () => {
		cy.visit("/");

		cy.contains("Home").click();
		
		cy.url().should("equal", Cypress.config().baseUrl + "/");
	});
});