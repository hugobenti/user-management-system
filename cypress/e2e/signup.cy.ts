/// <reference types="cypress" />

describe('Sign Up', () => {
  it('should not allow signup if passwords do not match', () => {
    cy.visit('/signup');
    cy.get('[data-testid="signup-first-name-input"]').type('Test');
    cy.get('[data-testid="signup-last-name-input"]').type('User');
    cy.get('[data-testid="signup-email-input"]').type('testuser@example.com');
    cy.get('[data-testid="signup-password-input"]').type('password123');
    cy.get('[data-testid="signup-confirm-password-input"]').type('password456');
    cy.get('[data-testid="signup-submit-btn"]').should('be.disabled');
  });

  it('should allow signup if passwords match', () => {
    cy.visit('/signup');
    cy.get('[data-testid="signup-first-name-input"]').type('Test');
    cy.get('[data-testid="signup-last-name-input"]').type('User');
    cy.get('[data-testid="signup-email-input"]').type('testuser2@example.com');
    cy.get('[data-testid="signup-password-input"]').type('password123');
    cy.get('[data-testid="signup-confirm-password-input"]').type('password123');
    cy.get('[data-testid="signup-submit-btn"]').should('not.be.disabled').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.contains('User Management Dashboard').should('exist');
  });
});
