const { monitorTransactions } = require('.');

console.log('Starting payment monitor...');

const stop = monitorTransactions({
  account: 'GC2BKLYOOYPDEFJKLKY6FNNRQMGFLVHJKQRGNSSRR4MPB7LQF5W7KDC2',
  onPayment: (payment) => {
    console.log(`Payment received: ${payment.amount} ${payment.asset_type}`);
  }
});

// Stop after 5 minutes
setTimeout(() => {
  stop();
  console.log('Monitoring stopped');
}, 300000);