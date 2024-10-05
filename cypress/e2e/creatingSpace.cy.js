import {spaceSel} from '../support/selectors';

describe('Creating space', () => {
    context('when creating a new space via API', () => {
        // ToDo check that no spaces there before run tests
        before(() => {
            // cy.login('ignateva.victoriia@gmail.com', 'GUksd$6U7vR:77k')
            cy.visit(`https://app.clickup.com/${Cypress.env('TEAM_ID')}/home`)
        })

        // Positive Test Case
        context('with minimal valid fields', () => {
            const spaceName = 'Space with correct params via API cy'

            it('creates a new space and returns status code 200', () => {
                // ToDo no options inside tests?
                const params = {
                    body: {
                        name: spaceName,
                        multiple_assignees: true
                    }
                }

                cy.apiRequest('POST', `/api/v2/team/${Cypress.env('TEAM_ID')}/space`, params).then(function (resp) {
                    expect(resp.status).to.eq(200)
                    cy.wrap(resp.body.id).as('spaceId')
                })
            })

            it('shows the new created space', () => {
                cy.get(spaceSel(spaceName)).should('be.visible')
            })

            after(function () {
                cy.apiRequest('DELETE', `/api/v2/space/${this.spaceId}`,)
            })
        })

        // ToDo add test with all fields

        // Negative Test Cases
        context('with invalid params', () => {
            it('returns status code 401 when invalid token', () => {
                const params = {
                    headers: {
                        Authorization: 'invalid_token'
                    },
                    body: {
                        name: 'Invalid token Space',
                        multiple_assignees: true
                    },
                    failOnStatusCode: false
                }

                cy.apiRequest('POST', `/api/v2/team/${Cypress.env('TEAM_ID')}/space`, params).then((resp) => {
                    expect(resp.status).to.eq(401)
                })
            })

            it('returns status code 400 when missing space name', () => {
                const params = {
                    failOnStatusCode: false,
                    body: {
                        name: '',
                        multiple_assignees: true,
                    }
                }

                cy.apiRequest('POST', `/api/v2/team/${Cypress.env('TEAM_ID')}/space`, params).then((resp) => {
                    expect(resp.status).to.eq(400)
                    expect(resp.body.err).to.contain('Space name invalid')
                })
            })

            it('returns status code 500 when invalid data type', () => {
                const params = {
                    failOnStatusCode: false,
                    body: {
                        name: 'Invalid Data Type',
                        multiple_assignees: 'Viktoria'
                    }
                }

                cy.apiRequest('POST', `/api/v2/team/${Cypress.env('TEAM_ID')}/space`, params).then((resp) => {
                    expect(resp.status).to.eq(500)
                    expect(resp.body.err).to.contain('invalid input syntax')
                })
            })
        })

        // Boundary Test Cases
        context('with minimum space name length', () => {
            it('creates a new space and returns status code 200', () => {
                const params = {
                    body: {
                        name: 'A',
                        multiple_assignees: true
                    }
                }

                cy.apiRequest('POST', `/api/v2/team/${Cypress.env('TEAM_ID')}/space`, params).then(function (resp) {
                    expect(resp.status).to.eq(200)
                    cy.wrap(resp.body.id).as('spaceId')
                })
            })

            after(function () {
                cy.apiRequest('DELETE', `/api/v2/space/${this.spaceId}`,)
            })
        })
    })
})