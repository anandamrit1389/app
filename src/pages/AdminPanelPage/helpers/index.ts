import { IPromoCode, PromoCodeType } from '@/interfaces/companies';

export interface BulkCodeData {
  create: {
    code: string;
    expiresAt: number;
    promoType: PromoCodeType;
  }[];
  update: {
    id: string;
    code: string;
    expiresAt: number;
  }[];
  delete: {
    id: string;
  }[];
}

export const diffPromoCodes = (
  origin: Partial<IPromoCode>[],
  editing: Partial<IPromoCode>[],
): BulkCodeData => {
  const byId = new Map(origin.map((x) => [x.id, x]));
  const create = editing.filter((x) => !x.id) as unknown as {
    code: string;
    expiresAt: Date;
    promoType: PromoCodeType;
  }[];

  const update = editing
    .filter((x) => !!x.id)
    .filter((x) => {
      const prev = byId.get(x.id);
      return prev && (prev.code !== x.code || prev.expiresAt !== x.expiresAt);
    }) as unknown as IPromoCode[];

  const codeIds = new Set(editing.map((x) => x.id));
  const del = origin.filter((x) => !codeIds.has(x.id));

  return {
    create: create.map((x) => {
      return { code: x.code.trim(), expiresAt: x.expiresAt.getTime(), promoType: x.promoType };
    }),
    update: update.map((x) => {
      return {
        id: x.id,
        code: x.code.trim(),
        expiresAt: new Date(x.expiresAt).getTime(),
      };
    }),
    delete: del.map(({ id }) => ({ id })) as unknown as { id: string }[],
  };
};

export const validateCodes = (codes: Partial<IPromoCode>[]): (string | null)[] | null => {
  const errors: (string | null)[] = Array(codes.length).fill(null);
  const seen = new Map<string, number>();

  codes.forEach(({ code }, index) => {
    const trimmed = code ? code.trim() : '';

    if (!trimmed) {
      errors[index] = 'Code cannot be empty';
      return;
    }

    if (seen.has(trimmed)) {
      const firstIndex = seen.get(trimmed)!;
      errors[index] = `Duplicate of code at position ${firstIndex + 1}`;
      if (!errors[firstIndex]) {
        errors[firstIndex] = `Duplicate of code at position ${index + 1}`;
      }
      return;
    }

    seen.set(trimmed, index);
  });

  return errors.every((err) => err === null) ? null : errors;
};
