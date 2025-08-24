/// <reference types="cypress" />

// Dashboard CRUD tests

describe('Dashboard CRUD', () => {
  beforeEach(() => {
    // Login (any user/pass works)
    cy.visit('/signin');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should load and display user card with id 1', () => {
    cy.wait(2000); // Wait for data to load
    cy.get('body').then($body => {
      cy.log('BODY HTML:');
      cy.log($body.html() || 'No HTML');
    });
    cy.get('[data-testid^="user-card-"]').then($cards => {
      cy.log('Found user cards:', $cards.length);
      $cards.each((i, el) => {
        console.log(el.getAttribute('data-testid') || 'no data-testid');
      });
    });
    cy.get('[data-testid="user-card-1"]', { timeout: 10000 }).should('exist');
  });

});
