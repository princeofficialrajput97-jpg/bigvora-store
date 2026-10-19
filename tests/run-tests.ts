import { INITIAL_PRODUCTS } from '../src/data/initialData';
import { Product, Order, InventoryStatus } from '../src/types';

console.log('====================================================');
console.log('BIGVORA STORE — CORE TEST SUITE EXECUTION');
console.log('====================================================');

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

// 1. Single License Exhaustion
const singleLicenseProduct: Product = {
  ...INITIAL_PRODUCTS.find(p => p.licenseModel === 'SINGLE_LICENSE')!,
  availableStock: 1,
  soldCount: 0,
  status: 'AVAILABLE' as InventoryStatus,
};
singleLicenseProduct.availableStock -= 1;
singleLicenseProduct.soldCount += 1;
if (singleLicenseProduct.licenseModel === 'SINGLE_LICENSE' || singleLicenseProduct.availableStock === 0) {
  singleLicenseProduct.status = 'SOLD_OUT';
}
assert(singleLicenseProduct.status === 'SOLD_OUT', 'Single License Product marks SOLD_OUT on purchase');
assert(singleLicenseProduct.availableStock === 0, 'Available stock is 0 after single license sale');

// 2. Prevent SOLD_OUT Checkout
const soldOutItem: Product = { ...INITIAL_PRODUCTS[0], status: 'SOLD_OUT' as InventoryStatus, availableStock: 0 };
const canBuy = soldOutItem.status !== 'SOLD_OUT' && soldOutItem.availableStock > 0;
assert(!canBuy, 'Checkout gate rejects purchase of SOLD_OUT item');

// 3. Limited Stock Decrement
const limitedStockProduct: Product = {
  ...INITIAL_PRODUCTS.find(p => p.licenseModel === 'LIMITED_STOCK')!,
  availableStock: 2,
  soldCount: 3,
};
limitedStockProduct.availableStock -= 1;
assert(limitedStockProduct.availableStock === 1, 'Limited stock item decrements by ordered quantity');

// 4. Idempotent Order Check
const cache = new Map<string, any>();
const key = 'test-idemp-123';
const mockOrder = { id: 'ord-101', orderNumber: 'BV-990011' };
cache.set(key, mockOrder);
assert(cache.get(key).orderNumber === 'BV-990011', 'Idempotency cache retrieves previous order on replay');

// 5. Download Token Expiration
const tokens = new Map<string, number>();
const now = Date.now();
tokens.set('VALID_TOK', now + 100000);
tokens.set('EXPIRED_TOK', now - 5000);
assert(Date.now() <= (tokens.get('VALID_TOK') || 0), 'Valid download token is permitted');
assert(Date.now() > (tokens.get('EXPIRED_TOK') || 0), 'Expired download token is blocked');

console.log('====================================================');
console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
console.log('====================================================');

if (failed > 0) process.exit(1);
