import { PetitionFile } from "./petition-file";

export interface Category {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
}

export interface Petition {
  id?: number;
  title: string;
  description: string;
  addressee: string;
  user_id?: number;
  category_id?: number;
  signatories?: number;
  status?: string;
  created_at?: Date;
  // Array de objetos PetitionFile
  files?: PetitionFile[];
  // Relaciones opcionales
  category?: Category;
  user?: User;

}
