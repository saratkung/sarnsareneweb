// SARNSARENE — customer address book (§14). Phase 4: ADDRESSES table.

import { prisma } from "@/lib/db";

export type AddressInput = {
  fullName: string;
  line1: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
};

export type SavedAddress = AddressInput & { id: string; isDefault: boolean };

const toAddress = (a: {
  id: string;
  fullName: string;
  line1: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}): SavedAddress => ({ ...a });

export async function listAddresses(userId: string): Promise<SavedAddress[]> {
  const rows = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
  return rows.map(toAddress);
}

export async function addAddress(userId: string, input: AddressInput): Promise<SavedAddress> {
  const count = await prisma.address.count({ where: { userId } });
  const makeDefault = input.isDefault || count === 0;

  return prisma.$transaction(async (tx) => {
    if (makeDefault) {
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const created = await tx.address.create({
      data: {
        userId,
        fullName: input.fullName.trim(),
        line1: input.line1.trim(),
        district: input.district.trim(),
        province: input.province.trim(),
        postalCode: input.postalCode.trim(),
        isDefault: makeDefault,
      },
    });
    return toAddress(created);
  });
}

export async function deleteAddress(userId: string, id: string): Promise<boolean> {
  const res = await prisma.address.deleteMany({ where: { id, userId } });
  return res.count > 0;
}

export async function setDefaultAddress(userId: string, id: string): Promise<boolean> {
  const owned = await prisma.address.findFirst({ where: { id, userId }, select: { id: true } });
  if (!owned) return false;
  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    prisma.address.update({ where: { id }, data: { isDefault: true } }),
  ]);
  return true;
}
