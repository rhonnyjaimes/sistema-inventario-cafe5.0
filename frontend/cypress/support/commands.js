Cypress.Commands.add('disableAnimations', () => {
  cy.window().then(win => {
    const style = win.document.createElement('style')
    style.innerHTML = `
      *,
      *::after,
      *::before {
        transition: none !important;
        animation: none !important;
      }
    `
    win.document.head.appendChild(style)
  })
})