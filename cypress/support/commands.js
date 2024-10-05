Cypress.Commands.add('login', (email, password) => {
    cy.clearCookies()
    cy.clearAllLocalStorage()

    cy.visit('https://app.clickup.com/login')
    cy.get('[data-test="login-email-input"]').type(email)
    cy.get('[data-test="login-password-input"]').type(password)
    cy.get('[data-test="login-submit"]').click()
    cy.get('[data-test="simple-sidebar"]', {timeout: 30000}).should('be.visible')
})

Cypress.Commands.add('apiRequest', (method, route, { headers, body, failOnStatusCode } = {}) => {
    const options = {
        method: method || 'GET',
        url: `${Cypress.env('HOST')}${route}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: Cypress.env('API_TOKEN'),
            ...headers
        },
        body,
        failOnStatusCode,
    }

    return cy.request(options)
})