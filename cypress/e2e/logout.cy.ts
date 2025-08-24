/// <reference types="cypress" />

describe('Logout', () => {
  it('should log out and redirect to signin', () => {
    // Login first
    cy.visit('/signin');
    cy.get('[data-testid="email-input"]').type('logoutuser@example.com');
    cy.get('[data-testid="password-input"]').type('logoutpass');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    // Click logout button
    cy.get('button').contains(/sign out|logout/i).click();
    cy.url({ timeout: 10000 }).should('include', '/signin');
    cy.get('[data-testid="email-input"]').should('exist');
  });
});
