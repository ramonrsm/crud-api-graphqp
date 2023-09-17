import { UserEntity } from "../../../../domain/entities/user-entity";
import { cache } from "../../../cache/node-cache";
import { database } from "../../../database";

export const resolvers = {
  Query: {
    hello(): string {
      return "Hello World!";
    },
    users(_object: unknown, args: Pick<UserEntity, "idUser">) {
      console.log(args);
      
      if (args.idUser) {
        const userCached = cache.get<UserEntity[]>(`users.${args.idUser}`);

        if (!!userCached) console.log("Cache", userCached);

        if (userCached?.length) return userCached;

        const userExists = database.schemas.user.filter(
          (user: UserEntity) => user.idUser === args.idUser
        );

        cache.set(`users.${args.idUser}`, userExists);

        console.log("DB", userExists);

        return userExists;
      }

      const usersCached = cache.get("users");

      if (!!usersCached) console.log("Cache", usersCached);

      if (usersCached) return usersCached;

      cache.set("users", usersCached);

      return database.schemas.user;
    },
  },
  Mutation: {
    saveUser(
      _object: unknown,
      args: { data: Pick<UserEntity, "fullName" | "email"> }
    ) {
      const idUser = database.schemas.user.length + 1;

      const userModel: UserEntity = {
        idUser: idUser.toString(),
        fullName: args.data.fullName,
        email: args.data.email,
      };

      database.schemas.user.push(userModel);

      cache.set(`users.${idUser}`, [userModel]);

      return [userModel];
    },
    updateUser(_object: unknown, args: { user: UserEntity }) {
      const userExists = cache.get<UserEntity[]>(`users.${args.user.idUser}`);

      let currentUser: UserEntity;

      if (!userExists?.length) {
        currentUser = database.schemas.user.find(
          (user) => user.idUser === args.user.idUser
        );

        console.log("DB", currentUser);
      } else {
        currentUser = userExists.shift() as UserEntity;
        console.log("Cache", currentUser);
      }

      if (!currentUser) return;

      const userIndex = database.schemas.user.findIndex(
        (user: UserEntity) => (user.idUser = args.user.idUser)
      );

      const currentUserUpdated: UserEntity = {
        idUser: currentUser.idUser,
        fullName: args.user.fullName ?? currentUser.fullName,
        email: args.user.email ?? currentUser.email,
      };

      database.schemas.user.splice(userIndex, 1, currentUserUpdated);

      cache.set(`users.${args.user.idUser}`, [currentUserUpdated]);

      return [currentUserUpdated];
    },
    deleteUser(_object: unknown, args: Pick<UserEntity, "idUser">) {
      const userExists = cache.get<UserEntity[]>(`users.${args.idUser}`);

      let currentUser: UserEntity;

      if (!userExists?.length) {
        currentUser = database.schemas.user.find(
          (user) => user.idUser === args.idUser
        );

        console.log("DB", currentUser);
      } else {
        currentUser = userExists.shift() as UserEntity;
        console.log("Cache", currentUser);
      }

      if (!currentUser) return false;

      const userIndex = database.schemas.user.findIndex(
        (user: UserEntity) => (user.idUser = args.idUser)
      );

      database.schemas.user.splice(userIndex, 1);

      cache.del(`users.${args.idUser}`);

      return true;
    },
  },
};
