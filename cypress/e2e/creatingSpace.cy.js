const baseOptions = {
    method: 'POST',
    url: 'https://api.clickup.com/api/v2/team/9015570628/space',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
    }
}

describe('Creating space', () => {
    describe('when creating a new space via API', () => {
        // ToDo check that no spaces there before run tests
        before(() => {
            //ToDo add a command for login
            //cy.clearCookies()
            //cy.clearAllLocalStorage()

            cy.visit('https://app.clickup.com/login')
            // ToDo
            // cy.get('[data-test="login-email-input"]').type('ignateva.victoriia@gmail.com')
            // cy.get('[data-test="login-password-input"]').type('GUksd$6U7vR:77k')
            // cy.get('[data-test="login-submit"]').click()
            // ToDo waiting and check that page is loaded not url
            cy.url({ timeout: 30000 }).should('contain', '9015570628')
        })

        // Positive Test Case
        context('with minimal valid fields', () => {
            it('creates a new space and returns status code 200', () => {
                // ToDo no options inside tests?
                const options = {
                    ...baseOptions,
                    body: {
                        name: 'Space with correct params via API cy',
                        multiple_assignees: true
                    }
                }

                cy.request(options).then((resp) => {
                    expect(resp.status).to.eq(200)
                    cy.wrap(resp.body.id).as('spaceId')
                })
            })

            it('shows the new created space', () => {
                cy.get('[data-test="project-row__name__Space with correct params via API cy"]').should('be.visible')
            })

            after(function () {
                const optionsForDelete = {
                    method: 'DELETE',
                    url: `https://api.clickup.com/api/v2/space/${this.spaceId}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
                    }
                }
                cy.request(optionsForDelete).then((resp) => {
                    expect(resp.status).to.eq(200)
                })
            })
        })

        // ToDo add test with all fields

        // Negative Test Cases
        context('with invalid authorization token', () => {
            it('returns status code 401', () => {
                const options = {
                    ...baseOptions,
                    headers: {
                        ...baseOptions.headers,
                        Authorization: 'invalid_token'
                    },
                    body: {
                        name: 'Invalid token Space',
                        multiple_assignees: true
                    }
                }

                cy.request({ ...options, failOnStatusCode: false }).then((resp) => {
                    expect(resp.status).to.eq(401)
                })
            })
        })

        context('with missing space name', () => {
            it('returns status code 400', () => {
                const options = {
                    ...baseOptions,
                    body: {
                        name: '',
                        multiple_assignees: true,
                    }
                }

                cy.request({ ...options, failOnStatusCode: false }).then((resp) => {
                    expect(resp.status).to.eq(400)
                    expect(resp.body.err).to.contain('Space name invalid')
                })
            })
        })

        context('with invalid data type', () => {
            it('returns status code 500', () => {
                const options = {
                    ...baseOptions,
                    body: {
                        name: 'Invalid Data Type',
                        multiple_assignees: 'Viktoria'
                    }
                }

                cy.request({ ...options, failOnStatusCode: false }).then((resp) => {
                    expect(resp.status).to.eq(500)
                    expect(resp.body.err).to.contain('invalid input syntax')
                })
            })
        })

        // Boundary Test Cases
        context('with minimum space name length', () => {
            it('creates a new space and returns status code 200', () => {
                const options = {
                    ...baseOptions,
                    body: {
                        name: 'A',
                        multiple_assignees: true
                    }
                }

                cy.request(options).then((resp) => {
                    expect(resp.status).to.eq(200)
                    cy.wrap(resp.body.id).as('spaceId')
                })
            })

            after(function () {
                const optionsForDelete = {
                    method: 'DELETE',
                    url: `https://api.clickup.com/api/v2/space/${this.spaceId}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
                    }
                }
                cy.request(optionsForDelete).then((resp) => {
                    expect(resp.status).to.eq(200)
                })
            })
        })
    })
})