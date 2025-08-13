const { calculatePathPayment } = require('../src/path-payment-calc');
const assert = require('assert');

describe('Path Payment Calculator', () => {
  it('should find path between native and USDC', async () => {
    const result = await calculatePathPayment({
      sourceAsset: 'native',
      destAsset: 'USDC:GA5ZSEJYB37JDA5VQU3I5L537Y2LC5RG5H5KQ6DC4YGHYF7UVI6SJDBX',
      destAmount: '10'
    });
    
    assert.ok(parseFloat(result.sourceAmount) > 0);
    assert.ok(result.path.length > 0);
  });

  it('should throw error when no path found', async () => {
    try {
      await calculatePathPayment({
        sourceAsset: 'XLM',
        destAsset: 'NONEXISTENT:GBAD...',
        destAmount: '10'
      });
      assert.fail('Should have thrown error');
    } catch (error) {
      assert.match(error.message, /No path found/);
    }
  });
});