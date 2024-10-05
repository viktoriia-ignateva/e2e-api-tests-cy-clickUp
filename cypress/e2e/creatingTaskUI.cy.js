const TEAM_ID = "9015570628"

describe("Creating Task via UI", () => {
    before(() => {
        // ToDo add a command for login
        // ToDO reusable selectors
        // ToDo add findByTestId

        //cy.intercept("https://prod-eu-west-1-3.clickup.com/**").as(

        cy.visit("https://app.clickup.com/login")
        // cy.get('[data-test="login-email-input"]').type("ignateva.victoriia@gmail.com")
        // cy.get('[data-test="login-password-input"]').type("GUksd$6U7vR:77k")
        // cy.get('[data-test="login-submit"]').click()

        cy.url({timeout: 30000}).should("include", TEAM_ID)
        //cy.get("#loading-placeholder").should("not.be.visible")

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
})