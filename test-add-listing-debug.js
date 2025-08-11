const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Test add-listing access and debug session/role issues
async function testAddListingAccess() {
  console.log('🔍 Testing add-listing access and debugging session/role issues...\n');

  const dbPath = path.join(__dirname, 'db', 'custom.db');
  const db = new sqlite3.Database(dbPath);

  try {
    // Check all users and their roles
    console.log('📋 All users in database:');
    await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          id, 
          email, 
          name, 
          role, 
          subscriptionStatus,
          emailVerified,
          createdAt,
          updatedAt
        FROM User 
        ORDER BY createdAt DESC
      `, [], (err, rows) => {
        if (err) {
          console.error('Database error:', err.message);
          reject(err);
          return;
        }
        
        if (!rows || rows.length === 0) {
          console.log('  No users found in database');
          resolve();
          return;
        }
        
        rows.forEach(user => {
          console.log(`- ID: ${user.id}`);
          console.log(`  Email: ${user.email}`);
          console.log(`  Name: ${user.name}`);
          console.log(`  Role: ${user.role} (type: ${typeof user.role})`);
          console.log(`  Subscription: ${user.subscriptionStatus}`);
          console.log(`  Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
          console.log(`  Created: ${user.createdAt}`);
          console.log('');
        });
        
        resolve();
      });
    });

    // Check sessions table
    console.log('🔐 Active sessions:');
    await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          s.id,
          s.userId,
          s.expires,
          u.email,
          u.name,
          u.role
        FROM Session s
        JOIN User u ON s.userId = u.id
        WHERE s.expires > datetime('now')
        ORDER BY s.expires DESC
      `, [], (err, rows) => {
        if (err) {
          console.error('Sessions query error:', err.message);
          reject(err);
          return;
        }
        
        if (!rows || rows.length === 0) {
          console.log('  No active sessions found');
        } else {
          rows.forEach(session => {
            console.log(`- Session ID: ${session.id}`);
            console.log(`  User: ${session.email} (${session.name})`);
            console.log(`  Role: ${session.role}`);
            console.log(`  Expires: ${session.expires}`);
            console.log('');
          });
        }
        
        resolve();
      });
    });

    // Check accounts table
    console.log('🔗 User accounts:');
    await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          a.id,
          a.userId,
          a.type,
          a.provider,
          a.providerAccountId,
          u.email,
          u.role
        FROM Account a
        JOIN User u ON a.userId = u.id
        ORDER BY a.userId
      `, [], (err, rows) => {
        if (err) {
          console.error('Accounts query error:', err.message);
          reject(err);
          return;
        }
        
        if (!rows || rows.length === 0) {
          console.log('  No accounts found');
        } else {
          rows.forEach(account => {
            console.log(`- Account ID: ${account.id}`);
            console.log(`  User: ${account.email}`);
            console.log(`  Role: ${account.role}`);
            console.log(`  Provider: ${account.provider}`);
            console.log(`  Type: ${account.type}`);
            console.log('');
          });
        }
        
        resolve();
      });
    });

    // Simulate middleware role check
    console.log('🛡️ Testing middleware role check logic:');
    
    const testRoles = ['AGENT', 'EXPERT', 'agent', 'admin', 'USER', 'user', null, undefined];
    const allowedRoles = ['AGENT', 'EXPERT', 'agent', 'admin'];
    
    testRoles.forEach(role => {
      const isAllowed = role && allowedRoles.includes(role);
      console.log(`  Role: ${role} (${typeof role}) -> ${isAllowed ? '✅ ALLOWED' : '❌ DENIED'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    db.close();
  }
}

testAddListingAccess();
