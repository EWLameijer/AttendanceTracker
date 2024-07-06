import { Student } from "./Student";

export interface Group {
  id: string;
  name: string;
  members: Student[];
  hasPastLessons: boolean;
}
