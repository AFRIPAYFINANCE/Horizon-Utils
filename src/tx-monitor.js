const StellarSdk = require('stellar-sdk');

/**
 * Real-time transaction monitor for Stellar accounts
 * @param {Object} options Configuration options
 * @param {string} options.account - Stellar account public key (required)
 * @param {Function} options.onPayment - Payment handler callback (required)
 * @param {Function} [options.onError] - Error handler callback
 * @param {string} [options.horizonUrl] - Horizon server URL (default: testnet)
 * @param {string} [options.cursor] - Starting cursor position (default: 'now')
 * @param {string} [options.asset] - Specific asset to monitor (default: all assets)
 * @returns {Function} Function to stop monitoring
 */
function monitorTransactions(options) {
    // Validate required parameters
    if (!options.account) {
        throw new Error('Account parameter is required');
    }
    if (!options.onPayment || typeof options.onPayment !== 'function') {
        throw new Error('onPayment callback function is required');
    }

    // Set default values
    const {
        horizonUrl = 'https://horizon-testnet.stellar.org',
        cursor = 'now',
        asset = null,
        onError = (error) => console.error('Monitoring error:', error)
    } = options;

    // Create Horizon server instance
    const server = new StellarSdk.Server(horizonUrl);
    
    // Track if monitoring has been stopped
    let isStopped = false;
    
    // Create the payment stream
    let paymentStream = server
        .payments()
        .forAccount(options.account)
        .cursor(cursor);
    
    // Filter by asset if specified
    if (asset) {
        paymentStream = paymentStream.forAsset(
            StellarSdk.Asset.fromString(asset)
        );
    }
    
    // Start streaming
    const eventSource = paymentStream.stream({
        onmessage: (payment) => {
            // Skip if monitoring has been stopped
            if (isStopped) return;
            
            // Process only successful payment operations
            if (payment.type === 'payment' && payment.transaction_successful) {
                options.onPayment({
                    id: payment.id,
                    amount: payment.amount,
                    asset: payment.asset_type,
                    assetCode: payment.asset_code || 'XLM',
                    assetIssuer: payment.asset_issuer,
                    from: payment.from,
                    to: payment.to,
                    memo: payment.memo,
                    memoType: payment.memo_type,
                    transactionHash: payment.transaction_hash,
                    createdAt: payment.created_at,
                    sourceAccount: payment.source_account
                });
            }
        },
        onerror: (error) => {
            if (!isStopped) onError(error);
        }
    });

    // Return stop function
    return () => {
        isStopped = true;
        if (eventSource) {
            eventSource.close();
        }
    };
}

module.exports = { monitorTransactions };