const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateSubtotal,
  applyDiscount,
  calculateDelivery,
  calculateTotal
} = require('../src/orderCalculator');

// Параметризованный тест для расчёта стоимости нескольких вариантов товара.
test('calculateSubtotal: корректно считает стоимость товаров', async (t) => {
  const cases = [
    {
      name: 'один товар',
      items: [{ price: 100, quantity: 1 }],
      expected: 100
    },
    {
      name: 'несколько товаров',
      items: [
        { price: 100, quantity: 2 },
        { price: 250, quantity: 1 }
      ],
      expected: 450
    },
    {
      name: 'товар с количеством больше одного',
      items: [{ price: 300, quantity: 4 }],
      expected: 1200
    }
  ];

  for (const testCase of cases) {
    await t.test(testCase.name, () => {
      // Arrange
      const items = testCase.items;

      // Act
      const result = calculateSubtotal(items);

      // Assert
      assert.equal(result, testCase.expected);
    });
  }
});

test('calculateSubtotal: пустая корзина имеет стоимость 0', () => {
  // Arrange
  const items = [];

  // Act
  const result = calculateSubtotal(items);

  // Assert
  assert.equal(result, 0);
});

test('applyDiscount: промокод STUDENT10 даёт скидку 10%', () => {
  // Arrange
  const amount = 2000;

  // Act
  const result = applyDiscount(amount, 'STUDENT10');

  // Assert
  assert.equal(result, 1800);
});

test('applyDiscount: промокод NODE20 даёт 20% скидки при сумме от 1000 рублей', () => {
  // Arrange
  const amount = 1500;

  // Act
  const result = applyDiscount(amount, 'NODE20');

  // Assert
  assert.equal(result, 1200);
});

test('applyDiscount: NODE20 работает при граничной сумме ровно 1000 рублей', () => {
  // Arrange
  const amount = 1000;

  // Act
  const result = applyDiscount(amount, 'NODE20');

  // Assert
  assert.equal(result, 800);
});

test('applyDiscount: NODE20 не применяется при сумме 999 рублей', () => {
  // Arrange
  const amount = 999;

  // Act
  const result = applyDiscount(amount, 'NODE20');

  // Assert
  assert.equal(result, 999);
});

test('applyDiscount: неизвестный промокод не даёт скидку', () => {
  // Arrange
  const amount = 2500;

  // Act
  const result = applyDiscount(amount, 'UNKNOWN');

  // Assert
  assert.equal(result, 2500);
});

test('calculateDelivery: курьерская доставка стоит 300 рублей', () => {
  // Arrange
  const amount = 1500;

  // Act
  const result = calculateDelivery(amount, 'courier');

  // Assert
  assert.equal(result, 300);
});

test('calculateDelivery: курьерская доставка бесплатна при сумме ровно 3000 рублей', () => {
  // Arrange
  const amount = 3000;

  // Act
  const result = calculateDelivery(amount, 'courier');

  // Assert
  assert.equal(result, 0);
});

test('calculateDelivery: самовывоз бесплатный', () => {
  // Arrange
  const amount = 5000;

  // Act
  const result = calculateDelivery(amount, 'pickup');

  // Assert
  assert.equal(result, 0);
});

test('calculateSubtotal: отрицательная цена вызывает ошибку', () => {
  // Arrange
  const items = [{ price: -100, quantity: 1 }];

  // Act & Assert
  assert.throws(() => calculateSubtotal(items), /Цена не может быть отрицательной/);
});

test('calculateSubtotal: нулевое количество вызывает ошибку', () => {
  // Arrange
  const items = [{ price: 100, quantity: 0 }];

  // Act & Assert
  assert.throws(
    () => calculateSubtotal(items),
    /Количество должно быть положительным целым числом/
  );
});

test('calculateSubtotal: дробное количество вызывает ошибку', () => {
  // Arrange
  const items = [{ price: 100, quantity: 1.5 }];

  // Act & Assert
  assert.throws(
    () => calculateSubtotal(items),
    /Количество должно быть положительным целым числом/
  );
});

test('calculateDelivery: неизвестный способ доставки вызывает ошибку', () => {
  // Arrange
  const amount = 1000;

  // Act & Assert
  assert.throws(
    () => calculateDelivery(amount, 'post'),
    /Неизвестный способ доставки/
  );
});

test('calculateTotal: корректно рассчитывает полный заказ', () => {
  // Arrange
  const order = {
    items: [
      { name: 'Клавиатура', price: 2500, quantity: 1 },
      { name: 'Кабель', price: 500, quantity: 2 }
    ],
    promoCode: 'STUDENT10',
    deliveryType: 'courier'
  };

  // Act
  const result = calculateTotal(order);

  // Assert
  assert.equal(result, 3150);
});