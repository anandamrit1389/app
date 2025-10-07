import { User } from '@/interfaces/IUser';

export function getInitials(user: User) {
  let initials = '';

  if (user.name) {
    const nameParts = user.name.trim().split(' ');

    if (nameParts.length === 1) {
      initials = nameParts[0].substring(0, 2).toUpperCase();
    } else {
      initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
  } else {
    const email = user.email.trim();
    initials = email[0].toUpperCase();
  }

  return initials;
}
