const { calculateTotal } = require('./orderCalculator');

async function placeOrder(order, paymentService) {
  const total = calculateTotal(order);
  const paymentId = await paymentService.pay(total);
  return paymentId;
}

module.exports = {
  placeOrder
};