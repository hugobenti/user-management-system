/// <reference types="cypress" />

// Authentication tests

describe('Authentication', () => {
  it('should login with any user and password', () => {
    cy.visit('/signin', { timeout: 20000 });
    cy.wait(1000); // Wait for page to render (debug)
    cy.get('[data-testid="email-input"]', { timeout: 10000 }).type('anyuser@example.com');
    cy.get('[data-testid="password-input"]', { timeout: 10000 }).type('anyPassword');
    cy.get('button[type="submit"]', { timeout: 10000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.contains('User Management Dashboard', { timeout: 10000 }).should('exist');
  });
});
