#!/usr/bin/env node

const http = require('http');
const https = require('https');

const services = [
  { name: 'Frontend (Next.js)', url: 'http://localhost:3000', port: 3000 },
  { name: 'Backend (NestJS)', url: 'http://localhost:3001', port: 3001 },
  { name: 'Backend Alt (NestJS)', url: 'http://localhost:3002', port: 3002 }
];

async function checkService(service) {
  return new Promise((resolve) => {
    const client = service.url.startsWith('https') ? https : http;
    
    const req = client.get(service.url, { timeout: 3000 }, (res) => {
      resolve({
        name: service.name,
        url: service.url,
        status: 'OK',
        statusCode: res.statusCode,
        responseTime: Date.now() - startTime
      });
    });

    const startTime = Date.now();

    req.on('error', (err) => {
      resolve({
        name: service.name,
        url: service.url,
        status: 'ERROR',
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: service.name,
        url: service.url,
        status: 'TIMEOUT',
        error: 'Connection timeout'
      });
    });
  });
}

async function checkAllServices() {
  console.log('🔍 Checking services status...\n');
  
  const results = await Promise.all(services.map(checkService));
  
  results.forEach(result => {
    const status = result.status === 'OK' ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    console.log(`   URL: ${result.url}`);
    
    if (result.status === 'OK') {
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Response Time: ${result.responseTime}ms`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });

  const workingServices = results.filter(r => r.status === 'OK');
  console.log(`📊 Summary: ${workingServices.length}/${services.length} services running`);
  
  if (workingServices.length === 0) {
    console.log('\n⚠️  No services are running. Please start the services:');
    console.log('   Frontend: npm run dev (in frontend directory)');
    console.log('   Backend: npm run start:dev (in backend directory)');
  }
}

checkAllServices().catch(console.error);
