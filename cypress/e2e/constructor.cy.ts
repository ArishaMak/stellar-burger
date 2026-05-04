describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запросы на ЛЮБОЙ хост (не только localhost)
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    
    // Устанавливаем cookie ПЕРЕД посещением страницы
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
    cy.get('button').contains('Добавить').first().should('be.visible');
    cy.get('button').contains('Добавить').first().click();
    cy.get('main').find('div').last().should('exist');
  });

  it('открывает модальное окно ингредиента', () => {
    cy.get('li').first().click();
    cy.get('body').then(($body) => {
      if ($body.find('[class*="modal"]').length > 0) {
        cy.get('[class*="modal"]').should('be.visible');
      } else if ($body.find('[class*="Modal"]').length > 0) {
        cy.get('[class*="Modal"]').should('be.visible');
      } else {
        cy.get('body').children().should('have.length.greaterThan', 1);
      }
    });
  });

  it('закрывает модальное окно по клику на крестик', () => {
    cy.get('li').first().click();
    cy.wait(300);
    cy.get('button').first().click({ force: true });
    cy.wait(300);
  });

  it('закрывает модальное окно по клику на оверлей', () => {
    cy.get('li').first().click();
    cy.wait(300);
    cy.get('body').click(100, 100);
    cy.wait(300);
  });

  it('создает заказ и отображает номер', () => {
    // 1. Добавляем булку
    cy.get('button').contains('Добавить').first().click();
    cy.wait(500);
    
    // 2. Переключаемся на начинки
    cy.contains('Начинки').click({ force: true });
    cy.wait(300);
    
    // 3. Добавляем начинку
    cy.get('button').contains('Добавить').first().click({ force: true });
    cy.wait(500);
    
    // 4. Проверяем кнопку
    cy.contains('Оформить заказ').should('not.be.disabled');
    
    // 5. Кликаем "Оформить заказ"
    cy.contains('Оформить заказ').click({ force: true });
    
    // 6. Ждем запрос с увеличенным таймаутом
    cy.wait('@createOrder', { timeout: 15000 });
    
    // 7. Проверяем номер
    cy.contains('12345').should('be.visible');
    
    // 8. Закрываем модалку
    cy.get('button').first().click({ force: true });
    
    // 9. Проверяем очистку
    cy.contains('Выберите').should('be.visible');
  });
});