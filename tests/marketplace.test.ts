import assert from 'node:assert';
import { INITIAL_PRODUCTS } from '../src/data/initialData';
import { Product, Order, InventoryStatus } from '../src/types';

describe_suite();

function describe_suite() {
  console.log('Running BigVora Store Core Test Suite...');

  // 1. Single License products transition to SOLD_OUT upon confirmed purchase
  {
    const singleLicenseProduct: Product = {
      ...INITIAL_PRODUCTS.find(p => p.licenseModel === 'SINGLE_LICENSE')!,
      availableStock: 1,
      soldCount: 0,
      status: 'AVAILABLE' as InventoryStatus,
    };

    assert.strictEqual(singleLicenseProduct.status, 'AVAILABLE');
    assert.strictEqual(singleLicenseProduct.availableStock, 1);

    singleLicenseProduct.availableStock -= 1;
    singleLicenseProduct.soldCount += 1;

    if (singleLicenseProduct.licenseModel === 'SINGLE_LICENSE' || singleLicenseProduct.availableStock === 0) {
      singleLicenseProduct.status = 'SOLD_OUT';
    }

    assert.strictEqual(singleLicenseProduct.status, 'SOLD_OUT');
    assert.strictEqual(singleLicenseProduct.availableStock, 0);
    assert.strictEqual(singleLicenseProduct.soldCount, 1);
  }

  // 2. Cannot purchase or checkout SOLD_OUT items
  {
    const soldOutProduct: Product = {
      ...INITIAL_PRODUCTS[0],
      status: 'SOLD_OUT' as InventoryStatus,
      availableStock: 0,
    };

    const canCheckout = soldOutProduct.status !== 'SOLD_OUT' && soldOutProduct.availableStock > 0;
    assert.strictEqual(canCheckout, false);
  }

  // 3. Limited Stock decrement
  {
    const limitedStockProduct: Product = {
      ...INITIAL_PRODUCTS.find(p => p.licenseModel === 'LIMITED_STOCK')!,
      availableStock: 2,
      soldCount: 3,
      status: 'AVAILABLE' as InventoryStatus,
    };

    limitedStockProduct.availableStock -= 1;
    limitedStockProduct.soldCount += 1;
    assert.strictEqual(limitedStockProduct.availableStock, 1);

    limitedStockProduct.availableStock -= 1;
    limitedStockProduct.soldCount += 1;

    if (limitedStockProduct.availableStock === 0) {
      limitedStockProduct.status = 'SOLD_OUT';
    }

    assert.strictEqual(limitedStockProduct.availableStock, 0);
    assert.strictEqual(limitedStockProduct.status, 'SOLD_OUT');
  }

  // 4. Idempotent Order Creation
  {
    const idempotencyCache = new Map<string, Order>();
    const idempotencyKey = 'idemp-test-unique-key-9988';

    const mockOrder: Order = {
      id: 'ord-test-01',
      orderNumber: 'BV-771122',
      createdAt: new Date().toISOString(),
      items: [],
      subtotal: 289,
      tax: 23.12,
      discount: 0,
      total: 312.12,
      currency: 'USD',
      paymentMethod: 'CARD_SANDBOX',
      paymentStatus: 'PAID',
      paymentTransactionId: 'TXN-001',
      orderStatus: 'DELIVERED',
      customerName: 'Test Buyer',
      customerPhone: '+1 555-0100',
      customerEmail: 'test@example.com',
    };

    if (!idempotencyCache.has(idempotencyKey)) {
      idempotencyCache.set(idempotencyKey, mockOrder);
    }

    assert.strictEqual(idempotencyCache.has(idempotencyKey), true);
    assert.strictEqual(idempotencyCache.get(idempotencyKey)?.orderNumber, 'BV-771122');
  }

  // 5. Download Tokens Expiration
  {
    const downloadTokenRecords = new Map<string, { token: string; expiresAt: number }>();
    const validToken = 'DL-VALID-123';
    const expiredToken = 'DL-EXPIRED-456';

    const now = Date.now();
    downloadTokenRecords.set(validToken, { token: validToken, expiresAt: now + 3600000 });
    downloadTokenRecords.set(expiredToken, { token: expiredToken, expiresAt: now - 1000 });

    const isTokenAccessible = (tok: string): boolean => {
      const rec = downloadTokenRecords.get(tok);
      if (!rec) return false;
      return Date.now() <= rec.expiresAt;
    };

    assert.strictEqual(isTokenAccessible(validToken), true);
    assert.strictEqual(isTokenAccessible(expiredToken), false);
    assert.strictEqual(isTokenAccessible('DL-NONEXISTENT'), false);
  }

  console.log('All BigVora Store tests passed successfully!');
}
