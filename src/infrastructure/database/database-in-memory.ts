import { UserEntity } from "../../domain/entities/user-entity";

type DatabaseInMemorySchemas<S extends string> = {
  [schemaName in S]: any[];
};

export class DatabaseInMemory {
  schemas: DatabaseInMemorySchemas<"user" | "company" | "address" | "role">;

  constructor() {
    this.schemas = {
      user: [
        {
          idUser: "1",
          fullName: "Ramon Moura",
          email: "ramonmourarsm@outlook.com",
        },
      ] as UserEntity[],
      company: [],
      address: [],
      role: [],
    };
  }
}
