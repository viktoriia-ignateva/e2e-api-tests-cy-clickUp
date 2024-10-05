const baseOptions = {
    method: 'POST',
    url: 'https://api.clickup.com/api/v2/list/901506912843/task',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
    }
}

describe('Creating Task via API', () => {
    before(() => {
        cy.login('ignateva.victoriia@gmail.com', 'GUksd$6U7vR:77k')
    })

    // Positive Test Cases
    context('with valid params', () => {
        it('creates a task with minimal valid fields and shows it in UI ', function () {
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

        it('creates a task with all valid fields and shows it in UI', function () {
            const options = {
                ...baseOptions,
                body: {
                    "name": "New Task via API cy (!@#$%^&*)",
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
                cy.get('[data-test="task-row-main__New Task via API cy (!@#$%^&*)"]', {timeout: 60000}).should('be.visible')
                cy.get('[data-test="task-row-main__New Task via API cy (!@#$%^&*)"]').click()
                cy.get('[data-test="task-view-task-label__taskid-button"]').should('contain', resp.body.id)
                cy.get('[data-test="task-title__title-overlay"]').should('contain', 'New Task via API cy (!@#$%^&*)')
                cy.get('[data-test="priorities-view__item-label-Urgent"]').should('contain', 'Urgent')
                cy.get('[data-test="task-editor"] > div > div').should('contain', 'Task Description')
                cy.get('[data-test="tags-select__name-shadow-tag name"]').should('contain', 'tag name')
                // ToDo add date check

                return cy.wrap(resp.body.id).as('taskId')
            })
        })

        afterEach(function () {
            if (this.taskId) {
                const optionsForDelete = {
                    method: 'DELETE',
                    url: `https://api.clickup.com/api/v2/task/${this.taskId}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
                    }
                }
                cy.request(optionsForDelete)
            }
        })
    })

    // Negative Test Cases
    context('with invalid params', () => {
        it('returns status code 400 when missing task name', () => {
            const options = {
                ...baseOptions,
                body: {
                    name: ''
                }
            }

            cy.request({...options, failOnStatusCode: false}).then((resp) => {
                expect(resp.status).to.eq(400)
                expect(resp.body.err).to.contain('Task name invalid')
            })
        })

        it('returns status code 400 when invalid data type', () => {
            const options = {
                ...baseOptions,
                body: {
                    "name": "New Task with invalid data type via API cy",
                    "due_date": "10/10/2024",
                }
            }

            cy.request({...options, failOnStatusCode: false}).then((resp) => {
                expect(resp.status).to.eq(400)
                expect(resp.body.err).to.contain('Date invalid')
            })
        })

        it('returns status code 400 when another user list_id used', () => {
            const options = {
                ...baseOptions,
                url: 'https://api.clickup.com/api/v2/list/8cjutq1-292/task',
                body: {
                    "name": "New Task with invalid data type via API cy",
                }
            }

            cy.request({...options, failOnStatusCode: false}).then((resp) => {
                expect(resp.status).to.eq(400)
                expect(resp.body.err).to.contain('List ID invalid')
            })
        })
    })
})