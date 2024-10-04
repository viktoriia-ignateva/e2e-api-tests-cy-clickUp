const options = {
    method: 'POST',
    url: 'https://api.clickup.com/api/v2/team/9015570628/space',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
    },
    body: {
        "name": "New Space From API cypress",
        "multiple_assignees": true,
        "features": {
            "due_dates": {
                "enabled": true,
                "start_date": false,
                "remap_due_dates": true,
                "remap_closed_due_date": false
            },
            "time_tracking": {
                "enabled": false
            },
            "tags": {
                "enabled": true
            },
            "time_estimates": {
                "enabled": true
            },
            "checklists": {
                "enabled": true
            },
            "custom_fields": {
                "enabled": true
            },
            "remap_dependencies": {
                "enabled": true
            },
            "dependency_warning": {
                "enabled": true
            },
            "portfolios": {
                "enabled": true
            }
        }
    }
}

describe('Creating space', () => {
    describe('when creating a new space via API', () => {
        describe('with correct params', () => {
            before(() => {
                //     ToDo add a command for login
                //     cy.clearCookies()
                //     cy.clearAllLocalStorage()
                //
                cy.visit('https://app.clickup.com/login')
                // cy.get('[data-test="login-email-input"]').type('ignateva.victoriia@gmail.com')
                // cy.get('[data-test="login-password-input"]').type('GUksd$6U7vR:77k')
                // cy.get('[data-test="login-submit"]').click()
                // ToDo waiting and check that page is loaded not url
                cy.url({ timeout: 30000 }).should('contain', '9015570628')
            })

            it('should receive status code 200', () => {
                // ToDo add other request for different cases
                cy.request(options).then((resp) => {
                    expect(resp.status).to.eq(200)
                    cy.wrap(resp.body.id).as('spaceId')
                })
            })

            it('shows the new created space', () => {
                cy.get('[data-test="project-row__name__New Space From API cypress"]').should('be.visible')
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