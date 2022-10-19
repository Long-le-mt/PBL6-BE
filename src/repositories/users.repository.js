import { BaseRepository } from "commons/base.repository";
import db from "models";
const User = db.User;

export class UsersRepository extends BaseRepository {
  constructor(model) {
    super(model);
    this.getUserByEmail = this.getUserByEmail.bind(this);
  }

  async getUserByEmail(email) {
    return await this.model.findOne({
      where: {
        email,
      },
    });
  }

  async getUserByConfirmToken(confirmToken) {
    return await this.model.findOne({
      where: {
        confirmToken,
      },
    });
  }
}

export default new UsersRepository(User);
