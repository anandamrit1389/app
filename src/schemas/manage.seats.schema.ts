import { z } from 'zod';

export const createManageSeatsSchema = (minSeats: number) => {
  return z.object({
    seats: z
      .number()
      .int()
      .positive({ message: 'Seats must be a positive integer' })
      .min(minSeats, { message: `Seats must be at least ${minSeats}` }),
  });
};

export type ManageSeatsData = {
  seats: number;
};
