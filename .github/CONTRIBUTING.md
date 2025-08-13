
### 2. Core Implementation Files
Create `src/tx-monitor.js`:
```javascript
const StellarSdk = require('stellar-sdk');

/**
 * Real-time transaction monitor for Stellar accounts
 * @param {Object} options Configuration options
 * @returns {Function} Function to stop monitoring
 */
function monitorTransactions(options) {
  const {
    horizonUrl = 'https://horizon-testnet.stellar.org',
    account,
    onPayment,
    onError = console.error,
    cursor = 'now'
  } = options;

  const server = new StellarSdk.Server(horizonUrl);
  let closed = false;
  
  const eventSource = server
    .payments()
    .forAccount(account)
    .cursor(cursor)
    .stream({
      onmessage: (payment) => {
        if (payment.type === 'payment' && !closed) {
          onPayment({
            id: payment.id,
            amount: payment.amount,
            asset_type: payment.asset_type,
            from: payment.from,
            to: payment.to,
            memo: payment.memo
          });
        }
      },
      onerror: (error) => {
        if (!closed) onError(error);
      }
    });

  return () => {
    closed = true;
    eventSource.close();
  };
}

module.exports = { monitorTransactions };