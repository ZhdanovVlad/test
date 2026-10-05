const test = require('node:test');
const assert = require('node:assert/strict');

const { placeOrder } = require('../src/orderService');

test('placeOrder: вызывает paymentService.pay один раз и передаёт правильную сумму', async () => {
  // Arrange
  const order = {
    items: [{ name: 'Товар', price: 1000, quantity: 1 }],
    promoCode: 'STUDENT10',
    deliveryType: 'courier'
  };

  const calls = [];
  const paymentService = {
    async pay(total) {
      calls.push(total);
      return 'payment-123';
    }
  };

  // Act
  const paymentId = await placeOrder(order, paymentService);

  // Assert
  assert.equal(paymentId, 'payment-123');
  assert.equal(calls.length, 1);
  assert.equal(calls[0], 1200);
});

test('placeOrder: корректно передаёт ошибку платёжного сервиса', async () => {
  // Arrange
  const order = {
    items: [{ name: 'Товар', price: 500, quantity: 1 }],
    deliveryType: 'pickup'
  };

  const paymentError = new Error('Платёж отклонён');
  let calls = 0;

  const paymentService = {
    async pay() {
      calls += 1;
      throw paymentError;
    }
  };

  // Act & Assert
  await assert.rejects(
    () => placeOrder(order, paymentService),
    (error) => error === paymentError
  );
  assert.equal(calls, 1);
});