describe('Check requests (first iteration for test)', () => {
  it.skip('should log in, create a task and check it', () => {
    // ToDo add a command for login
    // ToDO reusable selectors
    // ToDo why no .should().click()
    // ToDo add findByTestId
    cy.visit('https://app.clickup.com/login')
    cy.get('[data-test="login-email-input"]').type('ignateva.victoriia@gmail.com')
    cy.get('[data-test="login-password-input"]').type('GUksd$6U7vR:77k')
    cy.get('[data-test="login-submit"]').click()
    // ToDo waiting?
    cy.url({ timeout: 30000 }).should('contain', '9015570628')
    cy.get('[data-test="subcategory-row__List for cy"]').should('be.visible')

    // ToDo waiting?
    cy.get('[data-test="subcategory-row__List for cy"]', { timeout: 30000 }).click({force: true})
    cy.get('[data-test="views-bar__controller-row"]').should('be.visible')
    cy.get('[data-test="views-bar__controller-row"]').find('[data-test="create-task-menu__new-task-button"]').click()
    // ToDo waiting?
    cy.get('[data-test="draft-view__title-task"]', {timeout: 60000}).should('be.visible')
    // ToDo waiting for type?
    cy.get('[data-test="draft-view__title-task"]').type('draft')
    cy.get('[data-test="draft-view__title-task"]').clear()
    cy.get('[data-test="draft-view__title-task"]').type('New task title')
    cy.get('[data-test="draft-view__quick-create-create"]').click()
    cy.get('[data-test="task-row-main__New task title"]').should('be.visible')
    cy.get('[data-test="task-row-main__New task title"]').click()
    cy.get('[data-test="task-view-task-label__taskid-button"]').should('be.visible').invoke('text').then((text1) => {
      console.log("!!! " + text1)
      const options = {
        method: 'GET',
        url: `https://api.clickup.com/api/v2/task/${text1}?custom_task_ids=false`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
        }
      }
      // ToDo add checks
      cy.request(options)
    })
  })

  it('should log in, create a task via API and check it', () => {
    // ToDo add a command for login
    cy.visit('https://app.clickup.com/login')
    cy.get('[data-test="login-email-input"]').type('ignateva.victoriia@gmail.com')
    cy.get('[data-test="login-password-input"]').type('GUksd$6U7vR:77k')
    cy.get('[data-test="login-submit"]').click()
    cy.url({ timeout: 30000 }).should('contain', '9015570628')
    cy.get('[data-test="subcategory-row__List for cy"]').should('be.visible')

    const options = {
      method: 'POST',
      url: 'https://api.clickup.com/api/v2/list/901506892240/task',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'pk_42468827_FYLLFG10G4QMM8U1Z4V2AE9K3FTO4AFX'
      },
      body: {
        "name": "New Task via API cypress",
        "description": "New Task Description",
        "assignees": [
          183
        ],
        "tags": [
          "tag name 1"
        ],
        "priority": 3,
        "due_date": 1508369194377,
        "due_date_time": false,
        "time_estimate": 8640000,
        "start_date": 1567780450202,
        "start_date_time": false,
        "notify_all": true,
        "parent": null,
        "links_to": null
      }
    }
    cy.request(options).then(
        (response) => {
          const taskId = response.body.id
          // ToDO add checks
          cy.get('[data-test="task-row-main__New Task via API cypress"]', {timeout: 60000}).should('be.visible')
          cy.get('[data-test="task-row-main__New Task via API cypress"]').click()
          cy.get('[data-test="task-view-task-label__taskid-button"]').should('contain', taskId)
        }
    )
  })
})