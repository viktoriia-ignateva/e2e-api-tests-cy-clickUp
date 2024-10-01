describe('Login to ClickUp', () => {
  it('should log in successfully', () => {
    cy.visit('https://app.clickup.com/login')
    cy.get('[data-test="login-email-input"]').type('ignateva.victoriia@gmail.com')
    cy.get('[data-test="login-password-input"]').type('GUksd$6U7vR:77k')
    cy.get('[data-test="login-submit"]').click()
    cy.url({ timeout: 30000 }).should('contain', '9015570628')
    cy.get('[data-test="project-row__name__Space"]').should('be.visible')

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
    cy.request(options)
  })
})