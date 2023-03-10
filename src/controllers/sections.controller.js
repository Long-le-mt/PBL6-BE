import { SectionsService } from 'services';
import Response from 'helpers/response';
import { httpCodes, errors, pages } from 'constants';

class SectionsController {
  constructor(service) {
    this.service = service;
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getVideos = this.getVideos.bind(this);
  }

  async create(req, res) {
    try {
      const data = await this.service.create(req.body);
      return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
    } catch (error) {
      return Response.error(
        res,
        { message: errors.WHILE_CREATE.format('section') },
        400
      );
    }
  }

  async get(req, res) {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;

      if (id) {
        const data = await this.service.find(id);
        return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
        // eslint-disable-next-line no-else-return
      } else {
        // check on query page or limit valid
        // eslint-disable-next-line no-lonely-if
        const data = await this.service.findAll({
          // eslint-disable-next-line radix
          page: parseInt(page || pages.PAGE_DEFAULT),
          // eslint-disable-next-line radix
          limit: parseInt(limit || pages.LIMIT_DEFAULT),
        });

        return Response.success(
          res,
          { docs: data, pagination: data.pagination },
          httpCodes.STATUS_OK
        );
      }
    } catch (error) {
      return Response.error(
        res,
        { message: errors.WHILE_GET.format('section') },
        400
      );
    }
  }

  async getVideos(req, res) {
    try {
      // id of section
      const { id } = req.params;
      const data = await this.service.findVideosBySection(id);
      return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
    } catch (error) {
      return Response.error(
        res,
        { message: errors.WHILE_GET.format('videos of section') },
        400
      );
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);
      if (data) {
        return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
      }
      return Response.error(
        res,
        { message: errors.WHILE_GET.format('videos of section') },
        400
      );
    } catch (error) {
      return Response.error(
        res,
        { message: errors.WHILE_GET.format('videos of section') },
        400
      );
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await this.service.delete(id);

      return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
    } catch (error) {
      return Response.error(
        res,
        { message: errors.WHILE_DELETE.format('section') },
        400
      );
    }
  }
}

export default new SectionsController(SectionsService);
