import {
    barControllerSel, addNewTaskButtonSel, listSel, newTaskTitleInputSel,
    createNewTaskButtonSel, creatingTaskModelSel, addButtonSel, taskNameErrorSel, selectListDropdownSel
} from "../support/selectors"

const TEAM_ID = "9015570628"
const listName = "List"

describe("Creating Task via UI", () => {
    before(() => {
        // cy.login("ignateva.victoriia@gmail.com", "GUksd$6U7vR:77k")
        cy.visit("https://app.clickup.com/login")
        cy.get('[data-test="simple-sidebar"]', {timeout: 30000}).should("be.visible")
        cy.get(listSel(listName)).click()
    });

    context.skip("when the minimum required information is entered", () => {
        const taskTitle = "New task title"

        it("should allow creating a new task", () => {
            cy.get(barControllerSel, {timeout: 30000}).find(addNewTaskButtonSel).click()
            cy.get(newTaskTitleInputSel, {timeout: 60000}).should("be.visible").as("newTaskTitleInput")
            cy.get("@newTaskTitleInput").type("draft")
            cy.get("@newTaskTitleInput").clear()
            cy.get("@newTaskTitleInput").type(taskTitle)

            // intercept the request which is sent when the task is created
            cy.intercept("POST", "/tasks/v1/subcategory/*/task").as("createTask")
            cy.get(createNewTaskButtonSel).click()

            // save the task id for further checks
            cy.wait("@createTask").then(function (interception) {
                cy.wrap(interception.response.body.id).as("taskId")
            })

            cy.get(creatingTaskModelSel).should("not.exist")
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
                expect(response.body.name).to.eq(taskTitle)
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
            cy.visit(`https://app.clickup.com/${TEAM_ID}/home`)
        })

        it("should not allow creating a task without a name", () => {
            cy.get(addButtonSel, {timeout: 30000}).click()
            cy.get(newTaskTitleInputSel).click().clear()
            cy.get(createNewTaskButtonSel).click()
            cy.get(taskNameErrorSel).should("be.visible")
        })

        it("should not allow creating a task without a selected list", () => {
            cy.get(newTaskTitleInputSel).click().clear().type("New task")
            cy.get(selectListDropdownSel).should("not.exist")
            cy.get(createNewTaskButtonSel).click()
            cy.get(selectListDropdownSel).should("be.visible")
        })
    })
})