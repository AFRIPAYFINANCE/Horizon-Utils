# Horizon Utilities
> Tools for Stellar network interactions

```javascript
import { monitorTransactions } from '@afripay/horizon-utils';

const monitor = monitorTransactions({
  account: 'GABC123...',
  onPayment: (tx) => console.log(`Received ${tx.amount} XLM`)
});
