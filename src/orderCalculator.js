function calculateSubtotal(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items должен быть массивом');
  }

  let subtotal = 0;

  for (const item of items) {
    if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) {
      throw new Error('Цена не может быть отрицательной');
    }

    if (
      typeof item.quantity !== 'number' ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error('Количество должно быть положительным целым числом');
    }

    subtotal += item.price * item.quantity;
  }

  return subtotal;
}

function applyDiscount(amount, promoCode) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
    throw new Error('Сумма не может быть отрицательной');
  }

  if (promoCode === 'STUDENT10') {
    return amount * 0.9;
  }

  if (promoCode === 'NODE20' && amount >= 1000) {
    return amount * 0.8;
  }

  return amount;
}

function calculateDelivery(amount, deliveryType) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
    throw new Error('Сумма не может быть отрицательной');
  }

  if (deliveryType === 'pickup') {
    return 0;
  }

  if (deliveryType === 'courier') {
    return amount >= 3000 ? 0 : 300;
  }

  throw new Error('Неизвестный способ доставки');
}

function calculateTotal(order) {
  if (!order || typeof order !== 'object') {
    throw new TypeError('Некорректный заказ');
  }

  const subtotal = calculateSubtotal(order.items);
  const discountedAmount = applyDiscount(subtotal, order.promoCode);
  const delivery = calculateDelivery(discountedAmount, order.deliveryType);
  const total = discountedAmount + delivery;

  return Math.max(0, total);
}

module.exports = {
  calculateSubtotal,
  applyDiscount,
  calculateDelivery,
  calculateTotal
};