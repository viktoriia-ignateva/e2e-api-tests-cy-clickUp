// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) => {
    cy.clearCookies()
    cy.clearAllLocalStorage()

    cy.visit('https://app.clickup.com/login')
    cy.get('[data-test="login-email-input"]').type(email)
    cy.get('[data-test="login-password-input"]').type(password)
    cy.get('[data-test="login-submit"]').click()
    cy.get('[data-test="simple-sidebar"]', {timeout: 30000}).should('be.visible')
})