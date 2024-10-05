const TEAM_ID = "9015570628"

describe("Creating Task via UI", () => {
    before(() => {
        // ToDO reusable selectors
        // ToDo add findByTestId
        cy.login('ignateva.victoriia@gmail.com', 'GUksd$6U7vR:77k')

        // list is visible
        cy.get('[data-test="subcategory-row__List"]')
            .should("be.visible")
            .as("list")
        cy.get("@list").click()
    });

    context("when the minimum required information is entered", () => {
        it("should allow creating a new task", () => {
            cy.get('[data-test="views-bar__controller-row"]').should("be.visible")
            cy.get('[data-test="views-bar__controller-row"]')
                .find('[data-test="create-task-menu__new-task-button"]')
                .click()
            cy.get('[data-test="draft-view__title-task"]', {timeout: 60000}).should("be.visible")

            cy.get('[data-test="draft-view__title-task"]').type('draft')
            cy.get('[data-test="draft-view__title-task"]').clear()
            cy.get('[data-test="draft-view__title-task"]')
                .click()
                .type("New task title")

            // intercept the request which is sent when the task is created
            cy.intercept("POST", "/tasks/v1/subcategory/*/task").as("createTask")
            cy.get('[data-test="draft-view__quick-create-create"]').click()

            // save the task id for further checks
            cy.wait("@createTask").then(function (interception) {
                cy.wrap(interception.response.body.id).as("taskId")
            })

            cy.get('[data-test="modal__body]"]').should("not.exist")
        })

        it("receives a response to a request for a created task that is successful and contains the entered information", function () {
            const query = new URLSearchParams({
                custom_task_ids: "true",
                team_id: TEAM_ID
            }).toString()

            const options = {
                method: "GET",
                url: `https://api.clickup.com/api/v2/task/${this.taskId}?${query}`,
                headers: {
                    Authorization: "pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX",
                },
            }

            cy.request(options).then((response) => {
                expect(response.body.id).to.eq(this.taskId)
                expect(response.body.name).to.eq("New task title")
            })
        })

        after(function () {
            const optionsForDelete = {
                method: "DELETE",
                url: `https://api.clickup.com/api/v2/task/${this.taskId}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX",
                },
            }
            cy.request(optionsForDelete)
        })
    })

    context("when there are mandatory information missing", () => {
        before(() => {
            // ToDo add a command for login
            // ToDO reusable selectors
            // ToDo why no .should().click()
            // ToDo add findByTestId

            cy.visit(`https://app.clickup.com/${TEAM_ID}/home`)
            cy.get('[data-test="project-row__name__Don\'t delete this space"]', {timeout: 30000}).should("be.visible")
        })

        it("should not allow creating a task without a name", () => {
            cy.get('button[data-test="quick-create-modal-toggle-new-task"]')
                .should("be.visible")
                .click()

            cy.get('[data-test="draft-view__title-task"]').click().clear()

            cy.get('[data-test="draft-view__quick-create-create"]').click()
            cy.get('[data-pendo="quick-create-task-enter-task-name-error"]').should("be.visible")
        })

        it("should not allow creating a task without a selected list", () => {
            cy.get('[data-test="draft-view__title-task"]')
                .click()
                .clear()
                .type("New task")

            cy.get('[data-test="hierarchy-picker__menu"]').should("not.exist")
            cy.get('[data-test="draft-view__quick-create-create"]').click()
            cy.get('[data-test="hierarchy-picker__menu"]').should("be.visible")
        })
    })
})