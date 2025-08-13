const StellarSdk = require('stellar-sdk');

/**
 * Calculate optimal path for a payment
 * @param {Object} params 
 * @returns {Promise<Object>} Payment path details
 */
async function calculatePathPayment(params) {
  const {
    sourceAsset = 'native',
    destAsset,
    destAmount,
    sourceAccount,
    horizonUrl = 'https://horizon-testnet.stellar.org'
  } = params;

  const server = new StellarSdk.Server(horizonUrl);
  
  try {
    const paths = await server
      .strictSendPaths(
        StellarSdk.Asset.fromString(sourceAsset),
        '1', // We request paths for 1 unit to get ratio
        [StellarSdk.Asset.fromString(destAsset)]
      )
      .call();

    if (paths.records.length === 0) {
      throw new Error('No path found');
    }

    // Find the best path (lowest source amount)
    const bestPath = paths.records.reduce((best, current) => {
      const currentCost = parseFloat(current.source_amount);
      return currentCost < best.cost ? { cost: currentCost, path: current } : best;
    }, { cost: Infinity, path: null });

    return {
      sourceAmount: (bestPath.cost * parseFloat(destAmount)).toFixed(7),
      destinationAmount: destAmount,
      path: bestPath.path.path.map(asset => asset.toString()),
      assets: bestPath.path.path.map(asset => asset.toString())
    };
  } catch (error) {
    console.error('Path calculation error:', error);
    throw error;
  }
}

module.exports = { calculatePathPayment };