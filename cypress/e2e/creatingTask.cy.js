describe('Creating space', () => {
    describe('when creating a new task via API', () => {
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
            cy.url({timeout: 30000}).should('contain', '9015570628')
        })

        // Positive Test Case
        it('create a task via API and check it', function(){
            const options = {
                method: 'POST',
                url: 'https://api.clickup.com/api/v2/list/901506912843/task',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
                },
                body: {
                    "name": "New Task via API cy",
                    "description": "New Task Description",
                }
            }

            cy.request(options).then((resp) => {
                cy.wrap(resp.body.id).as('taskId')
                // ToDO add checks
                cy.get('[data-test="task-row-main__New Task via API cy"]', {timeout: 60000}).should('be.visible')
                cy.get('[data-test="task-row-main__New Task via API cy"]').click()
                cy.get('[data-test="task-view-task-label__taskid-button"]').should('contain', resp.body.id)
                cy.get('[data-test="task-title__title-overlay"]').should('contain', 'New Task via API cy')

                return cy.wrap(resp.body.id)
            })
        })

        after(function () {
            const optionsForDelete = {
                method: 'DELETE',
                url: `https://api.clickup.com/api/v2/task/${this.taskId}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
                }
            }
            cy.request(optionsForDelete)
        })
    })
})