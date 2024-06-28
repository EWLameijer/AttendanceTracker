import Role from "../-shared/Role";

const roleNames = {
  [Role.TEACHER]: "docent",
  [Role.COACH]: "studentbegeleider",
  [Role.ADMIN]: "administrator",
  [Role.PURE_ADMIN]: "alleen-personeel-beheerder",
  [Role.SUPER_ADMIN]: "super-administrator",
};

export default roleNames;
