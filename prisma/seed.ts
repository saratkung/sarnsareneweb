// ============================================================
// SARNSARENE — database seed.
// Idempotent: safe to run repeatedly (upserts, skips existing).
//   npm run db:seed
// ============================================================

import { PrismaClient } from "@prisma/client";
import {
  SEED_PRODUCTS,
  categories,
  collections,
} from "../lib/commerce/catalog/data";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  // --- taxonomy ---
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c });
  }
  for (const c of collections) {
    await prisma.collection.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c });
  }

  // --- products ---
  for (const p of SEED_PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { id: p.id } });
    if (existing) {
      console.log(`· product ${p.id} exists — skipping`);
      continue;
    }

    await prisma.product.create({
      data: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        categorySlug: p.categorySlug,
        collectionSlug: p.collectionSlug,
        status: p.status,
        price: p.price,
        shortDescription: p.shortDescription,
        story: p.story,
        details: p.details,
        featuredRank: p.featuredRank ?? null,
        createdAt: new Date(p.createdAt),
        colors: {
          create: p.colors.map((c, i) => ({
            colorKey: c.id,
            name: c.name,
            swatch: c.swatch,
            images: c.images,
            position: i,
          })),
        },
        sizes: {
          create: p.sizes.map((s, i) => ({
            sizeKey: s.id,
            name: s.name,
            note: s.note ?? null,
            position: i,
          })),
        },
      },
    });

    const created = await prisma.product.findUniqueOrThrow({
      where: { id: p.id },
      include: { colors: true, sizes: true },
    });
    const colorId = new Map(created.colors.map((c) => [c.colorKey, c.id]));
    const sizeId = new Map(created.sizes.map((s) => [s.sizeKey, s.id]));

    await prisma.productVariant.createMany({
      data: p.variants.map((v) => ({
        id: v.id,
        productId: p.id,
        colorId: colorId.get(v.colorId)!,
        sizeId: sizeId.get(v.sizeId)!,
        sku: v.sku,
        stock: v.stock,
        price: v.price ?? null,
      })),
    });
    console.log(`✓ product ${p.id} (${p.variants.length} variants)`);
  }

  // --- admin user ---
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sarnsarene.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "sarnsarene";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "SARNSARENE Admin",
      role: "ADMIN",
      passwordHash: await hashPassword(adminPassword),
    },
  });
  console.log(`✓ admin user ${adminEmail}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
