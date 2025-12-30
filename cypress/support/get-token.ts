import 'cypress-data-session';

const getToken = (): Cypress.Chainable<any> => {
  return cy.api({
    method: 'GET',
    url: '/auth/fake-token',
  })
  .its('body.token')
}

const maybeGetToken = (sessionName: string): Cypress.Chainable<any> => {
  return cy.dataSession({
    name: sessionName,
    validate: (): boolean => true,
    setup: getToken,
    shareAcrossSpecs: true
  })
}

Cypress.Commands.add('maybeGetToken', maybeGetToken);
