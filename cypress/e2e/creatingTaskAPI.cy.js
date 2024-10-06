import {
    priorityLabelSel,
    tagSel,
    taskDescriptionSel,
    taskIdButtonSel,
    taskTitleSel
} from "../support/selectors";

describe('Creating Task via API', () => {
    before(() => {
        cy.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'))

        cy.getListId()
    })

    // Positive Test Cases
    context('with valid params', () => {
        it('creates a task with minimal valid fields and shows it in UI ', function () {
            const taskName = 'New Task via API with minimal valid fields cy'
            const params = {
                body: {
                    "name": taskName
                }
            }

            cy.apiRequest('POST', `/api/v2/list/${this.listId}/task`, params).then((resp) => {
                cy.visit(`https://app.clickup.com/t/${resp.body.id}`)
                cy.get(taskIdButtonSel, { timeout: 30000 }).should('contain', resp.body.id)
                cy.get(taskTitleSel).should('contain', taskName)

                return cy.wrap(resp.body.id).as('taskId')
            })
        })

        it('creates a task with all valid fields and shows it in UI', function () {
            const taskName = 'New Task via API cy (!@#$%^&*)'
            const priorityLabel = 'Urgent'
            const tagName = 'tag name'

            const params = {
                body: {
                    "name": taskName,
                    "description": "Task Description",
                    "tags": [
                        tagName
                    ],
                    "priority": 1, // Urgent
                    "due_date": 1508369194377,
                    "due_date_time": false,
                    "time_estimate": 8640000,
                    "start_date": 1567780450202,
                    "start_date_time": false,
                    "notify_all": true,
                }
            }

            cy.apiRequest('POST', `/api/v2/list/${this.listId}/task`, params).then((resp) => {
                cy.visit(`https://app.clickup.com/t/${resp.body.id}`)
                cy.get(taskIdButtonSel, { timeout: 30000 }).should('contain', resp.body.id)
                cy.get(taskTitleSel).should('contain', taskName)
                cy.get(priorityLabelSel(priorityLabel)).should('contain', priorityLabel)
                cy.get(taskDescriptionSel).should('contain', 'Task Description')
                cy.get(tagSel(tagName)).should('contain', tagName)
                // ToDo add date check

                return cy.wrap(resp.body.id).as('taskId')
            })
        })

        afterEach(function () {
            if (this.taskId) {
                cy.apiRequest('DELETE', `/api/v2/task/${this.taskId}`,)
            }
        })
    })

    // Negative Test Cases
    context('with invalid params', () => {
        it('returns status code 400 when missing task name', function () {
            const params = {
                body: {
                    name: ''
                },
                failOnStatusCode: false
            }

            cy.apiRequest('POST', `/api/v2/list/${this.listId}/task`, params).then((resp) => {
                expect(resp.status).to.eq(400)
                expect(resp.body.err).to.contain('Task name invalid')
            })
        })

        it('returns status code 400 when invalid data type', function () {
            const params = {
                body: {
                    "name": "New Task with invalid data type via API cy",
                    "due_date": "10/10/2024",
                },
                failOnStatusCode: false
            }

            cy.apiRequest('POST', `/api/v2/list/${this.listId}/task`, params).then((resp) => {
                expect(resp.status).to.eq(400)
                expect(resp.body.err).to.contain('Date invalid')
            })
        })

        it('returns status code 400 when another user list_id used', () => {
            const params = {
                body: {
                    "name": "New Task with invalid data type via API cy",
                },
                failOnStatusCode: false
            }

            cy.apiRequest('POST', '/api/v2/list/8cjutq1-292/task', params).then((resp) => {
                expect(resp.status).to.eq(400)
                expect(resp.body.err).to.contain('List ID invalid')
            })
        })
    })
})