/// <reference types="cypress" />

// Dashboard CRUD tests

describe("Dashboard CRUD", () => {
  let createdUserId: number;

  beforeEach(() => {
    // Login (any user/pass works)
    cy.visit("/signin");
    cy.get('[data-testid="email-input"]').type("test@example.com");
    cy.get('[data-testid="password-input"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("should load and display user card with id 1", () => {
    cy.wait(2000); // Wait for data to load
    cy.get("body").then(($body) => {
      cy.log("BODY HTML:");
      cy.log($body.html() || "No HTML");
    });
    cy.get('[data-testid^="user-card-"]').then(($cards) => {
      cy.log("Found user cards:", $cards.length);
      $cards.each((i, el) => {
        console.log(el.getAttribute("data-testid") || "no data-testid");
      });
    });
    cy.get('[data-testid="user-card-1"]', { timeout: 10000 }).should("exist");
  });

  it("should create a new user and find its card by id", () => {
    cy.get('[data-testid^="user-card-"]').then(($cards) => {
      const nextId = 13;
      createdUserId = nextId;
      cy.get(`[data-testid="user-card-${nextId}"]`).should("not.exist");
      cy.get('[data-testid="add-user-btn"]').click();
      cy.get('[data-testid="first-name-input"]').type("John");
      cy.get('[data-testid="last-name-input"]').type("Doe");
      cy.get('[data-testid="user-email-input"]').type("john.doe@example.com");
      cy.get('[data-testid="submit-user-btn"]').click();
      cy.get(`[data-testid="user-card-${nextId}"]`, { timeout: 10000 }).should(
        "exist"
      );
    });
  });

  it("should edit the first user", () => {
    cy.get('[data-testid="user-card-1"]')
      .within(() => {
        cy.contains(/edit/i).click();
      });
    cy.get('[data-testid="first-name-input"]').clear().type("Name");
    cy.get('[data-testid="last-name-input"]').clear().type("Test");
    cy.get('[data-testid="user-email-input"]')
      .clear()
      .type("test@example.com");
    cy.get('[data-testid="submit-user-btn"]').click();
    cy.get('[data-testid="user-1-email"]').within(() => {
      cy.contains("test@example.com");
    });
  });

  it("should delete the last created user", () => {
    cy.get('[data-testid^="user-card-"]').then(($cards) => {
      const ids = $cards
        .toArray()
        .map((card) =>
          parseInt(card.getAttribute("data-testid")!.replace("user-card-", ""))
        );
      const maxId = ids.length ? Math.max(...ids) : 0;
      const deleteId = maxId;
      cy.get(`[data-testid="user-card-${deleteId}"]`).within(() => {
        cy.contains(/delete/i).click();
      });
      cy.on("window:confirm", () => true);
      cy.get(`[data-testid="user-card-${deleteId}"]`, {
        timeout: 10000,
      }).should("not.exist");
    });
  });
});
