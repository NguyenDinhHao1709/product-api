const http = require('http');

const BASE_URL = 'http://localhost:3000';

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: body ? JSON.parse(body) : null });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting CRUD Verification Tests ---');

  // Wait a moment for server to be ready
  await new Promise((r) => setTimeout(r, 1000));

  // 1. Healthcheck
  console.log('1. Testing GET /health ...');
  const healthRes = await request('GET', '/health');
  console.log('Response:', healthRes);
  if (healthRes.status !== 200 || healthRes.data.mongodb !== 'connected') {
    throw new Error('Healthcheck failed: MongoDB not connected');
  }

  const testProduct = {
    pid: 'P001',
    pname: 'Laptop Dell XPS 15',
    price: 1500,
    quantity: 10
  };

  // Clean up if already exists
  await request('DELETE', `/api/products/${testProduct.pid}`);

  // 2. CREATE
  console.log('2. Testing POST /api/products ...');
  const postRes = await request('POST', '/api/products', testProduct);
  console.log('Response:', postRes);
  if (postRes.status !== 201 || postRes.data.pid !== testProduct.pid) {
    throw new Error('Create product failed');
  }

  // 3. READ ALL
  console.log('3. Testing GET /api/products ...');
  const getAllRes = await request('GET', '/api/products');
  console.log(`Found ${getAllRes.data.length} products`);
  if (getAllRes.status !== 200 || !Array.isArray(getAllRes.data)) {
    throw new Error('Get all products failed');
  }

  // 4. READ ONE
  console.log(`4. Testing GET /api/products/${testProduct.pid} ...`);
  const getOneRes = await request('GET', `/api/products/${testProduct.pid}`);
  console.log('Response:', getOneRes);
  if (getOneRes.status !== 200 || getOneRes.data.pid !== testProduct.pid) {
    throw new Error('Get one product failed');
  }

  // 5. UPDATE
  console.log(`5. Testing PUT /api/products/${testProduct.pid} ...`);
  const updateData = { pname: 'Laptop Dell XPS 15 (Updated)', price: 1600, quantity: 8 };
  const putRes = await request('PUT', `/api/products/${testProduct.pid}`, updateData);
  console.log('Response:', putRes);
  if (putRes.status !== 200 || putRes.data.price !== 1600 || putRes.data.quantity !== 8) {
    throw new Error('Update product failed');
  }

  // 6. DELETE
  console.log(`6. Testing DELETE /api/products/${testProduct.pid} ...`);
  const deleteRes = await request('DELETE', `/api/products/${testProduct.pid}`);
  console.log('Response:', deleteRes);
  if (deleteRes.status !== 200) {
    throw new Error('Delete product failed');
  }

  console.log('--- ALL CRUD TESTS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test failed with error:', err.message);
  process.exit(1);
});
