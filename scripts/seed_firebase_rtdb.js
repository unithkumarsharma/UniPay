const RTDB_URL = "https://unipay-3b9c6-default-rtdb.firebaseio.com";

async function seedFirebaseRealtimeDB() {
  console.log("Seeding Firebase Realtime Database at:", RTDB_URL);

  const initialUsers = {
    ADM001: {
      id: "adm001_fallback",
      userId: "ADM001",
      name: "Surya (Admin)",
      email: "admin@unipay.com",
      phone: "9876543210",
      role: "admin",
      walletBalance: 200000,
      status: "active",
      city: "Delhi",
      state: "Delhi"
    },
    ACC001: {
      id: "acc001_fallback",
      userId: "ACC001",
      name: "Unith (Accountant)",
      email: "accountant@unipay.com",
      phone: "9876543211",
      role: "accountant",
      walletBalance: 150000,
      status: "active",
      city: "Delhi",
      state: "Delhi"
    },
    MD001: {
      id: "md001_fallback",
      userId: "MD001",
      name: "Ajay (MD)",
      email: "ajay@unipay.com",
      phone: "9876543212",
      role: "master_distributor",
      walletBalance: 100000,
      status: "active",
      city: "Delhi",
      state: "Delhi"
    },
    DST001: {
      id: "dst001_fallback",
      userId: "DST001",
      name: "Ram (Distributor)",
      email: "ram@unipay.com",
      phone: "9876543213",
      role: "distributor",
      walletBalance: 50000,
      status: "active",
      city: "Noida",
      state: "UP"
    },
    RTL001: {
      id: "rtl001_fallback",
      userId: "RTL001",
      name: "Rohan (Retailer)",
      email: "rohan@unipay.com",
      phone: "9876543214",
      role: "retailer",
      shopName: "Rohan Mobile Point",
      walletBalance: 20000,
      status: "active",
      city: "Noida",
      state: "UP"
    },
    RTL002: {
      id: "rtl002_fallback",
      userId: "RTL002",
      name: "Mohan (Retailer)",
      email: "mohan@unipay.com",
      phone: "9876543215",
      role: "retailer",
      shopName: "Mohan Digital Seva",
      walletBalance: 20000,
      status: "active",
      city: "Noida",
      state: "UP"
    }
  };

  try {
    // 1. Put users node in Firebase Realtime DB
    const usersRes = await fetch(`${RTDB_URL}/users.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initialUsers)
    });
    const usersData = await usersRes.json();
    console.log("Firebase Realtime DB Users seeded successfully:", Object.keys(usersData || {}));

    // 2. Reset transactions & fund requests to null/empty in Firebase Realtime DB
    await fetch(`${RTDB_URL}/transactions.json`, { method: "DELETE" });
    await fetch(`${RTDB_URL}/fundRequests.json`, { method: "DELETE" });
    await fetch(`${RTDB_URL}/complaints.json`, { method: "DELETE" });
    console.log("Firebase Realtime DB Transactions, Fund Requests, Complaints cleared to ZERO!");

    console.log("🔥 Firebase Realtime Database (unipay-3b9c6) 100% Seeded & Ready!");
  } catch (err) {
    console.error("Firebase Realtime DB Seed Error:", err.message);
  }
}

seedFirebaseRealtimeDB();
