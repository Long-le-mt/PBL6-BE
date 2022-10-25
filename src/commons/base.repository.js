import logger from 'configs/winston.config';
import { errors, infors } from 'constants';

export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(input) {
    try {
      const data = await this.model.create(input);
      logger.info(infors.CREATE_AT_REPO_SUCCESS.format(this.model.name));

      return data;
    } catch (error) {
      logger.error(
        `${errors.CREATE_AT_REPO.format(this.model.name)} - ${error}`
      );
      throw new Error(error);
    }
  }

  async updateByPk(id, data) {
    const itemUpdate = await this.find(id);
    if (!itemUpdate) {
      throw new Error('Item update not found');
    }

    Object.assign(itemUpdate, data);

    const dataUpdate = await itemUpdate.save();
    return dataUpdate;
  }

  async updateByCondition(condition, input) {
    try {
      const data = await this.model.update(
        { ...input },
        {
          where: { ...condition },
          returning: true,
        }
      );
      logger.info(
        infors.UPDATE_BY_CONDITION_AT_REPO_SUCCESS.format(this.model.name)
      );

      return data;
    } catch (error) {
      logger.error(
        `${errors.UPDATE_BY_CONDITION_AT_REPO.format(
          this.model.name
        )} - ${error}`
      );
      throw new Error(error);
    }
  }

  async delete(id) {
    try {
      const data = await this.model.destroy({
        where: {
          id,
        },
      });
      logger.info(infors.DELETE_AT_REPO_SUCCESS.format(this.model.name));

      return data;
    } catch (error) {
      logger.error(
        `${errors.DELETE_AT_REPO.format(this.model.name)} - ${error}`
      );
      throw new Error(error);
    }
  }

  async find(id) {
    try {
      const data = await this.model.findByPk(id);
      logger.info(infors.FIND_BY_ID_AT_REPO_SUCCESS.format(this.model.name));

      return data;
    } catch (error) {
      logger.error(
        `${errors.FIND_BY_ID_AT_REPO.format(this.model.name)} - ${error}`
      );
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const data = await this.model.findAll();
      logger.info(infors.FIND_AT_REPO_SUCCESS.format(this.model.name));

      return data;
    } catch (error) {
      logger.error(`${errors.FIND_AT_REPO.format(this.model.name)} - ${error}`);
      throw new Error(error);
    }
  }

  async findOneByCondition(condition, isFindDeleted = false) {
    try {
      const data = await this.model.findOne({
        where: { ...condition },
        paranoid: !isFindDeleted,
      });

      logger.info(
        infors.FIND_ONE_BY_CONDITION_AT_REPO_SUCCESS.format(this.model.name)
      );

      return data;
    } catch (error) {
      logger.error(
        `${errors.FIND_ONE_BY_CONDITION_AT_REPO.format(
          this.model.name
        )} - ${error}`
      );
      throw new Error(error);
    }
  }

  async findAllByCondition(condition, isFindDeleted) {
    try {
      const query = this.model.findAll({
        where: { ...condition },
        paranoid: !isFindDeleted,
      });

      const data = await query;

      logger.info(
        infors.FIND_ALL_BY_CONDITION_AT_REPO_SUCCESS.format(this.model.name)
      );

      return data;
    } catch (error) {
      logger.error(
        `${errors.FIND_ALL_BY_CONDITION_AT_REPO.format(
          this.model.name
        )} - ${error}`
      );
      throw new Error(error);
    }
  }
}
