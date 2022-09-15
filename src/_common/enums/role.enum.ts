export enum Role {
  ADMIN = 0,
  LECTURER = 1,
  STUDENT = 2,
}

export function isAdmin(role: Role): role is Role.ADMIN {
  return role === Role.ADMIN;
}

export function isLecturer(role: Role): role is Role.LECTURER {
  return role === Role.LECTURER;
}

export function isStudent(role: Role): role is Role.STUDENT {
  return role === Role.STUDENT;
}
