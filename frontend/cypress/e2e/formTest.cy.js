describe('Test de Formulario de Registro', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/auth/registro').as('registroRequest')
      cy.visit('/registro')
    })
  
    it('Debe cargar el formulario correctamente', () => {
      // Verificar elementos principales
      cy.contains('h2', 'Crear Cuenta').should('be.visible')
      cy.get('input[name="nombre"]').should('exist')
      cy.get('input[name="email"]').should('exist')
      cy.get('input[name="contrasena"]').should('exist')
      cy.get('select[name="rol"]').should('exist')
      cy.contains('button', 'Registrar cuenta').should('be.enabled')
    })
  
    it('Debe mostrar errores de validación', () => {
      // Campos vacíos
      cy.contains('button', 'Registrar cuenta').click()
      cy.contains('Todos los campos son obligatorios').should('be.visible')
  
      // Email inválido
      cy.get('input[name="email"]').type('emailinvalido')
      cy.contains('button', 'Registrar cuenta').click()
      cy.contains('Formato de email inválido').should('be.visible')
  
      // Contraseña corta
      cy.get('input[name="contrasena"]').type('123')
      cy.contains('button', 'Registrar cuenta').click()
      cy.contains('La contraseña debe tener al menos 8 caracteres').should('be.visible')
  
      // Rol no seleccionado
      cy.get('input[name="contrasena"]').clear().type('contrasenavalida')
      cy.contains('button', 'Registrar cuenta').click()
      cy.contains('Todos los campos son obligatorios').should('be.visible')
    })
  
    it('Debe manejar correo ya registrado', () => {
      // Mock de error
      cy.intercept('POST', '**/auth/registro', {
        statusCode: 400,
        body: { tipo: 'usuario_existente', msg: 'El correo ya está registrado' }
      })
  
      // Rellenar formulario correctamente
      cy.get('input[name="nombre"]').type('Usuario Test')
      cy.get('input[name="email"]').type('existente@correo.com')
      cy.get('input[name="contrasena"]').type('contrasenasegura123')
      cy.get('select[name="rol"]').select('operario')
      cy.contains('button', 'Registrar cuenta').click()
  
      // Verificar error
      cy.contains('El correo ya está registrado').should('be.visible')
    })
  
    it('Debe completar registro exitosamente', () => {
      // Mock de éxito
      cy.intercept('POST', '**/auth/registro', {
        statusCode: 200,
        body: { message: 'Usuario registrado exitosamente' }
      })
  
      // Rellenar formulario
      cy.get('input[name="nombre"]').type('Nuevo Usuario')
      cy.get('input[name="email"]').type('nuevo@correo.com')
      cy.get('input[name="contrasena"]').type('contrasenasegura123')
      cy.get('select[name="rol"]').select('supervisor')
      cy.contains('button', 'Registrar cuenta').click()
  
      // Verificar modal de éxito
      cy.get('.fixed.inset-0.bg-black\\/50').should('be.visible')
      cy.contains('¡Registro Exitoso!').should('be.visible')
  
      // Verificar redirección
      cy.wait(3000)
      cy.location('pathname').should('eq', '/')
    })
  
    it('Debe navegar a login desde el formulario', () => {
      cy.contains('Iniciar sesión').click()
      cy.location('pathname').should('eq', '/login')
    })
  })