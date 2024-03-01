export interface Teacher {
  id: string;
  name: string;
  role: ATRole;
}

enum ATRole {
  Coach,
  Teacher,
}
