import logger from 'configs/winston.config';
import { errors, infors } from 'constants';
import BaseRepository from 'commons/base.repository';
import db from 'models';
import { roles } from 'constants';

const { User } = db;

export class UsersRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async getUserByEmail(email) {
    try {
      const data = await this.findOneByCondition({
        email,
      });

      logger.info(infors.FIND_AT_REPO_SUCCESS.format(this.model.name));

      return data;
    } catch (error) {
      logger.error(
        `${errors.CREATE_AT_REPO.format(this.model.name)} - ${error}`
      );
      throw new Error(error);
    }
  }

  async getUserByConfirmToken(confirmToken) {
    const user = await this.findOneByCondition({
      confirmToken,
    });
    return user;
  }

  async countAllUser() {
    try {
      const data = await this.model.count({
        where: {
          role: {
            $or: [roles.INSTRUCTOR_ROLE, roles.USER_ROLE],
          },
        },
        paranoid: false,
      });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new UsersRepository(User);
