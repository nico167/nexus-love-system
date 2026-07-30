import { MongoClient, Collection } from "mongodb";
import bcrypt from "bcryptjs";

interface SeedUser {
  username: string;
  name: string;
  password: string;
  role: "ADMIN" | "VIP";
  createdAt: Date;
  updatedAt: Date;
}

async function ensureUser(
  collection: Collection<SeedUser>,
  username: string,
  name: string,
  password: string,
  role: "ADMIN" | "VIP"
) {
  const existing = await collection.findOne({ username });
  if (existing) {
    console.log(`   ↳ ${username} ya existe, omitiendo.`);
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await collection.insertOne({
    username,
    name,
    password: hash,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(`   ↳ ${username} creado con rol ${role}.`);
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL no está definida");
  }

  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "nicocarmona";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "nico16783*";
  const vipUsername   = process.env.SEED_VIP_USERNAME   ?? "isi";
  const vipPassword   = process.env.SEED_VIP_PASSWORD   ?? "22022026";

  console.log("🌱 Conectando a MongoDB Atlas...");
  const client = new MongoClient(url);
  await client.connect();
  console.log("✅ Conexión exitosa.\n");

  const users = client.db().collection<SeedUser>("User");

  await ensureUser(users, adminUsername, "Nico Carmona", adminPassword, "ADMIN");
  await ensureUser(users, vipUsername, "Isi", vipPassword, "VIP");

  await client.close();

  console.log("\n✅ Seed completado:");
  console.log(`   Admin : ${adminUsername}`);
  console.log(`   VIP   : ${vipUsername}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
