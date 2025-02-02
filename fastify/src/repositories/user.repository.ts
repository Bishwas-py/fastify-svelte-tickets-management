export class UserRepository implements IUserRepository {
  constructor(private readonly db: Db) {}

  async findByUsername(username: string): Promise<DbUser | null> {
    return this.db.collection<DbUser>('users').findOne({ username });
  }

  async create(user: CreateUserDto): Promise<DbUser> {
    const now = new Date();
    const newUser: DbUser = {
      _id: new ObjectId(),
      ...user,
      createdAt: now,
      updatedAt: now
    };
    await this.db.collection<DbUser>('users').insertOne(newUser);
    return newUser;
  }
}
