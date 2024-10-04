const baseOptions = {
    method: 'POST',
    url: 'https://api.clickup.com/api/v2/list/901506912843/task',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
    }
}

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

        // Positive Test Cases
        context('with minimal valid fields', () => {
            it('creates a task and shows it in UI', function(){
                const options = {
                    ...baseOptions,
                    body: {
                        "name": "New Task via API with minimal valid fields cy"
                    }
                }

                cy.request(options).then((resp) => {
                    cy.get('[data-test="task-row-main__New Task via API with minimal valid fields cy"]', {timeout: 60000}).should('be.visible')
                    cy.get('[data-test="task-row-main__New Task via API with minimal valid fields cy"]').click()
                    cy.get('[data-test="task-view-task-label__taskid-button"]').should('contain', resp.body.id)
                    cy.get('[data-test="task-title__title-overlay"]').should('contain', 'New Task via API with minimal valid fields cy')

                    return cy.wrap(resp.body.id).as('taskId')
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

        context('with all valid fields', () => {
            it('creates a task and shows it in UI', function(){
                const options = {
                    ...baseOptions,
                    body: {
                        "name": "New Task via API cy",
                        "description": "Task Description",
                        "tags": [
                            "tag name"
                        ],
                        "priority": 1,
                        "due_date": 1508369194377,
                        "due_date_time": false,
                        "time_estimate": 8640000,
                        "start_date": 1567780450202,
                        "start_date_time": false,
                        "notify_all": true,
                    }
                }

                cy.request(options).then((resp) => {
                    cy.get('[data-test="task-row-main__New Task via API cy"]', {timeout: 60000}).should('be.visible')
                    cy.get('[data-test="task-row-main__New Task via API cy"]').click()
                    cy.get('[data-test="task-view-task-label__taskid-button"]').should('contain', resp.body.id)
                    cy.get('[data-test="task-title__title-overlay"]').should('contain', 'New Task via API cy')
                    cy.get('[data-test="priorities-view__item-label-Urgent"]').should('contain', 'Urgent')
                    cy.get('[data-test="task-editor"] > div > div').should('contain', 'Task Description')
                    cy.get('[data-test="tags-select__name-shadow-tag name"]').should('contain', 'tag name')
                    // ToDo add date check

                    return cy.wrap(resp.body.id).as('taskId')
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
})