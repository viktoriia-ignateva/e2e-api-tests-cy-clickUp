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

Cypress.Commands.add('getTeamId', function () {
    return cy.apiRequest('GET', '/api/v2/team').then(function (teamsRes) {
        return cy.wrap(teamsRes.body.teams[0].id).as('teamId')
    })
})


Cypress.Commands.add('getListId', function () {
    return cy.apiRequest('GET', '/api/v2/team').then(function (teamsRes) {
        cy.wrap(teamsRes.body.teams[0].id).as('teamId')
        const query = new URLSearchParams({archived: 'false'}).toString();

        // get space id
        cy.apiRequest('GET', `/api/v2/team/${teamsRes.body.teams[0].id}/space?${query}`).then(function (spacesRes) {
            cy.wrap(spacesRes.body.spaces[0].id).as('spaceId')

            // get folder id
            cy.apiRequest('GET', `/api/v2/space/${spacesRes.body.spaces[0].id}/folder?${query}`).then(function (folderRes) {
                cy.wrap(folderRes.body.folders[0].id).as('folderId')

                // get list id
                cy.apiRequest('GET', `/api/v2/folder/${folderRes.body.folders[0].id}/list?${query}`).then(function (listRes) {
                    cy.wrap(listRes.body.lists[0].id).as('listId')
                })
            })
        })
    })
})