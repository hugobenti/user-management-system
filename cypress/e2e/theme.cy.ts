/// <reference types="cypress" />

describe('Theme Toggle', () => {
  it('should toggle between light and dark themes and persist selection', () => {
    cy.visit('/signin');
    cy.get('[data-testid="theme-toggle-btn"]').click();
    cy.get('html').should('have.class', 'light');
    cy.reload();
    cy.get('html').should('have.class', 'light');
    cy.get('[data-testid="theme-toggle-btn"]').click();
    cy.get('html').should('have.class', 'dark');
  });
});
