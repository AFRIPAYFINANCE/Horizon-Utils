const { monitorTransactions } = require('../src/tx-monitor');
const assert = require('assert');
const sinon = require('sinon');

describe('Transaction Monitor', () => {
  it('should call onPayment when payment occurs', (done) => {
    const onPayment = sinon.spy();
    
    const stop = monitorTransactions({
      account: 'GABC123',
      onPayment: (payment) => {
        onPayment(payment);
        assert.strictEqual(payment.amount, '10.0000000');
        stop();
        done();
      },
      // Mock Horizon stream would be implemented here
    });
  });

  it('should stop monitoring when stop function is called', () => {
    const stop = monitorTransactions({
      account: 'GABC123',
      onPayment: () => {}
    });
    
    stop();
    // Would verify event source closed
  });
});