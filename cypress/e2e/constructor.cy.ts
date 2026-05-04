describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    
    cy.setCookie('accessToken', 'fake-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fake-refresh');
    });

    cy.viewport(1300, 800);
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => win.localStorage.removeItem('refreshToken'));
  });

  it('добавляет ингредиент из списка в конструктор', () => {
    cy.get('li').first().invoke('text').as('ingredientName');
    cy.get('li').first().find('button').contains('Добавить').click();
    cy.get('@ingredientName').then((name) => {
      cy.get('main').contains(name.trim()).should('be.visible');
    });
  });

  it('открывает модальное окно ингредиента с верными данными', () => {
    cy.get('li').first().invoke('text').as('ingredientName');
    cy.get('li').first().click();
    cy.contains('Детали ингредиента', { timeout: 5000 }).should('be.visible');
    cy.get('@ingredientName').then((name) => {
      cy.get('body').contains(name.trim()).should('be.visible');
    });
  });

  it('закрывает модальное окно по клику на крестик', () => {
    cy.get('li').first().click();
    cy.contains('Детали ингредиента').should('be.visible');
    
    // Ищем SVG иконку закрытия (CloseIcon обычно рендерит SVG)
    // Она находится внутри button, который в header модалки
    cy.get('svg').first().click({ force: true });
    
    // Ждем закрытия
    cy.contains('Детали ингредиента', { timeout: 7000 }).should('not.exist');
  });

  it('закрывает модальное окно по клику на оверлей', () => {
  cy.get('li').first().click();
  cy.contains('Детали ингредиента').should('be.visible');
  
  cy.get('#modals').children().last().click({ force: true });
  
  cy.contains('Детали ингредиента', { timeout: 7000 }).should('not.exist');
});

  it('создает заказ и отображает номер', () => {
    cy.get('li').first().find('button').contains('Добавить').click();
    cy.wait(500);
    
    cy.contains('Начинки').click({ force: true });
    cy.wait(300);
    
    cy.get('li').first().find('button').contains('Добавить').click({ force: true });
    cy.wait(500);
    
    cy.contains('Оформить заказ').should('not.be.disabled');
    cy.contains('Оформить заказ').click({ force: true });
    cy.wait('@createOrder', { timeout: 15000 });
    
    cy.contains('12345', { timeout: 5000 }).should('be.visible');
    cy.get('svg').first().click({ force: true });
    cy.contains('Выберите').should('be.visible');
  });
});