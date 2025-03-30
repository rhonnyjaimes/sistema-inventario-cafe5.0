// cypress/e2e/1-complexView.cy.js
describe('Pruebas del Login (Vista Compleja)', () => {
    beforeEach(() => {
      cy.visit('/login') // Asegúrate que esta ruta coincide con tu router
      cy.intercept('POST', '**/auth/login').as('loginRequest')
    })
  
    it('Debe cargar correctamente la página de login', () => {
      // Verificar elementos estáticos
      cy.get('img[alt="Logo Café 5.0"]').should('be.visible')
      cy.contains('h2', 'Iniciar Sesión').should('exist')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="contrasena"]').should('be.visible')
      cy.contains('button', 'Ingresar al sistema').should('be.enabled')
    })
  
    it('Debe manejar el login exitoso correctamente', () => {
      // Mock de respuesta exitosa
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
          usuario: { id: 1, nombre: 'Usuario Test' }
        }
      }).as('mockLogin')
  
      // Llenar formulario
      cy.get('input[name="email"]').type('usuario@valido.com')
      cy.get('input[name="contrasena"]').type('password123')
      cy.contains('button', 'Ingresar al sistema').click()
  
      // Verificar loading state
      cy.contains('Procesando...').should('exist')
      cy.get('button').should('be.disabled')
  
      // Verificar redirección y localStorage
      cy.wait('@mockLogin')
      cy.location('pathname').should('eq', '/dashboard')
      cy.window().its('localStorage.token').should('exist')
      cy.window().its('localStorage.user').should('contain', 'Usuario Test')
    })
  
    it('Debe mostrar errores de autenticación', () => {
        // 1. Verificar que el botón existe desde el inicio
        cy.get('[data-testid="submit-btn"]')
          .should('be.visible')
          .and('contain', 'Ingresar al sistema')
          .and('not.be.disabled')
      
        // 2. Test de validación de campos vacíos
        cy.get('[data-testid="submit-btn"]').click()
        
        // Verificar validaciones nativas
        cy.get('input[name="email"]:invalid').should('exist')
        cy.get('input[name="contrasena"]:invalid').should('exist')
      
        // 3. Test de error del servidor
        // Mock de error
        cy.intercept('POST', '**/auth/login', {
          statusCode: 401,
          body: { msg: 'Credenciales incorrectas' }
        }).as('loginError')
      
        // Llenar campos
        cy.get('input[name="email"]').type('test@example.com')
        cy.get('input[name="contrasena"]').type('password123')
        cy.get('[data-testid="submit-btn"]').click()
      
        // Verificar loading y estado deshabilitado
        cy.get('[data-testid="submit-btn"]')
          .should('be.disabled')
          .and('contain', 'Procesando...')
      
        // Esperar respuesta y error
        cy.wait('@loginError')
        cy.get('[data-testid="error-message"]', { timeout: 8000 })
          .should('be.visible')
          .and('contain', 'Credenciales incorrectas')
      })  


    it('Debe manejar la navegación a otras páginas', () => {
      cy.contains('Volver al Inicio').click()
      cy.location('pathname').should('eq', '/')
      
      cy.visit('/login')
      cy.contains('Regístrate aquí').click()
      cy.location('pathname').should('eq', '/registro')
    })
  })