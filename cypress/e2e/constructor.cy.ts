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
    const ingredientName = 'Булочка для бургера';

    // Добавляем булку
    cy.contains(ingredientName).parents('li').find('button').click();

    // проверяем что булка добавилась (появилась на странице)
    cy.contains(ingredientName).should('be.visible');
    
    // И проверяем что кнопка "Оформить заказ" стала активна (значит что-то добавлено)
    cy.contains('Оформить заказ').should('not.be.disabled');
});

    it('открывает модальное окно ингредиента с верными данными', () => {
        const ingredientName = 'Булочка для бургера';

        cy.contains(ingredientName).click();
        cy.contains('Детали ингредиента', { timeout: 5000 }).should('be.visible');

        // Проверяем что название есть ВНУТРИ #modals
        cy.get('#modals').contains(ingredientName).should('be.visible');
    });

    it('закрывает модальное окно по клику на крестик', () => {
        cy.contains('Булочка для бургера').click();
        cy.contains('Детали ингредиента').should('be.visible');

        // Ищем SVG иконку закрытия ВНУТРИ модалки
        cy.get('#modals').find('svg').first().click({ force: true });

        cy.contains('Детали ингредиента', { timeout: 7000 }).should('not.exist');
    });

    it('закрывает модальное окно по клику на оверлей', () => {
        cy.contains('Булочка для бургера').click();
        cy.contains('Детали ингредиента').should('be.visible');

        // Оверлей - это второй ребенок в #modals.
        // Кликаем в левый верхний угол, чтобы не задеть модалку сверху
        cy.get('#modals').children().eq(1).click('topLeft', { force: true });

        cy.contains('Детали ингредиента', { timeout: 7000 }).should('not.exist');
    });

    it('создает заказ и отображает номер', () => {
        // Добавляем булку
        cy.contains('Булочка для бургера').parents('li').find('button').click();
        cy.wait(500);

        // Переключаемся на начинки
        cy.contains('Начинки').click({ force: true });
        cy.wait(300);

        // Добавляем КОНКРЕТНУЮ начинку
        cy.contains('Начинка для бургера').parents('li').find('button').click({ force: true });
        cy.wait(500);

        // Оформляем заказ
        cy.contains('Оформить заказ').click({ force: true });
        cy.wait('@createOrder', { timeout: 15000 });

        // Ищем номер ВНУТРИ #modals
        cy.get('#modals').contains('12345').should('be.visible');

        // Закрываем модалку заказа
        cy.get('#modals').find('button').first().click({ force: true });

        // Проверяем очистку (конкретные плейсхолдеры)
        cy.contains('Выберите булки').should('be.visible');
        cy.contains('Выберите начинку').should('be.visible');
    });
});