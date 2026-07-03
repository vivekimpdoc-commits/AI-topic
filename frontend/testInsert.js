import { inductPersonnel } from './src/mockData.js';
import * as dotenv from 'dotenv';
dotenv.config(); // Ensure env vars are loaded

async function test() {
  try {
    console.log("Attempting insert...");
    await inductPersonnel({
      id: `p-${Date.now()}`,
      pno_number: "TEST-PNO-11",
      name: "Test",
      rank: "SI",
      phone_number: "9998887771",
      email: "test1@upp.gov.in",
      current_status: "AVAILABLE"
    });
    console.log("Success!");
  } catch (err) {
    console.error("Failed:", err);
  }
}

test();
