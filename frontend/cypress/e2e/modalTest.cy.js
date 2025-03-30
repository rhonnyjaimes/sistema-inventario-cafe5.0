// cypress/e2e/2-modalTest.cy.js
describe('Test de Modal de Edición en Materia Prima', () => {
    before(() => {
      // Mock de datos
      cy.fixture('granos.json').as('granosData')
      cy.fixture('proveedores.json').as('proveedoresData')
    })
  
    beforeEach(() => {
      // Configurar mocks
      cy.intercept('GET', '**/api/granos', { fixture: 'granos.json' }).as('getGranos')
      cy.intercept('GET', '**/api/proveedores', { fixture: 'proveedores.json' }).as('getProveedores')
  
      // Autenticación
      cy.window().then(win => {
        win.localStorage.setItem('token', 'fake-token')
        win.localStorage.setItem('user', JSON.stringify({
          nombre: "Usuario Test",
          email: "test@example.com",
          rol: "supervisor"
        }))
      })
  
      cy.visit('/matprima')
      cy.wait(['@getGranos', '@getProveedores'], { timeout: 15000 })
    })
  
    it('Flujo completo de edición con aprobación', function() {
      // Mock de PUT
      cy.intercept('PUT', '**/api/granos/*', {
        statusCode: 200,
        body: { message: 'Lote actualizado' }
      }).as('updateLote')
  
      // Paso 1: Abrir modal de aprobación
      cy.get('button:contains("Editar")').first().click({ force: true })
  
      // Paso 2: Modal de aprobación
      cy.get('.bg-white.rounded-lg.p-6.w-full.max-w-md:has(h3:contains("Aprobación Requerida"))')
        .should('be.visible')
        .as('approvalModal')
      
      // Contraseña incorrecta
      cy.get('@approvalModal').within(() => {
        cy.get('input[type="password"]').type('wrongpass')
        cy.contains('button', 'Aprobar Edición').click()
        cy.contains('Contraseña de aprobación incorrecta').should('exist')
      })
  
      // Contraseña correcta
      cy.get('@approvalModal').within(() => {
        cy.get('input[type="password"]')
          .clear()
          .type('SUPERVISOR1234')
        cy.contains('button', 'Aprobar Edición').click()
      })
  
      // Paso 3: Modal de edición
      cy.get('.bg-white.rounded-lg.p-6.w-full.max-w-md:has(h3:contains("Editar Lote"))', { timeout: 10000 })
        .should('be.visible')
        .as('editModal')
      
      // Validar y modificar campos
      cy.get('@editModal').within(() => {
        cy.get('input[name="origen"]').should('have.value', this.granosData[0].origen)
        cy.get('input[name="cantidad_kg"]')
          .clear()
          .type('2000')
          .should('have.value', '2000')
        
        cy.contains('button', 'Guardar Cambios').click()
      })
  
      // Verificar cierre
      cy.wait('@updateLote', { timeout: 15000 })
      cy.get('@editModal').should('not.exist')
    })
  
    it('Cierre del modal por diferentes métodos', () => {
      // Abrir modal
      cy.get('button:contains("Editar")').first().click({ force: true })
  
      // Método 1: Overlay
      cy.get('.fixed.inset-0.bg-black\\/50').click({ force: true })
      cy.get('.bg-white.rounded-lg.p-6').should('not.exist')
  
      // Método 2: ESC
      cy.get('button:contains("Editar")').first().click({ force: true })
      cy.get('body').type('{esc}')
      cy.get('.bg-white.rounded-lg.p-6').should('not.exist')
  
      // Método 3: Botón Cancelar
      cy.get('button:contains("Editar")').first().click({ force: true })
      cy.contains('button', 'Cancelar').click()
      cy.get('.bg-white.rounded-lg.p-6').should('not.exist')
    })
  
    it('Validación de campos requeridos', function() {
      // Ejecutar flujo completo
      cy.get('button:contains("Editar")').first().click({ force: true })
      cy.get('.bg-white.rounded-lg.p-6').within(() => {
        cy.get('input[type="password"]').type('SUPERVISOR1234')
        cy.contains('button', 'Aprobar Edición').click()
      })
  
      // Manipular formulario
      cy.get('.bg-white.rounded-lg.p-6:has(h3:contains("Editar Lote"))', { timeout: 10000 })
        .within(() => {
          cy.get('input[name="origen"]').clear()
          cy.get('input[name="cantidad_kg"]').clear()
          cy.contains('button', 'Guardar Cambios').click()
          cy.contains('Por favor complete todos los campos requeridos').should('be.visible')
        })
    })
  })