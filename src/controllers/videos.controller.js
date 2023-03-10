import { VideosService } from 'services';
import Response from 'helpers/response';
import { httpCodes, errors, pages } from 'constants';
import { delUrlFilesOnRedis } from 'helpers/redis';

class VideosController {
  constructor(service) {
    this.service = service;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.get = this.get.bind(this);
    this.getInstructorUploadVideo = this.getInstructorUploadVideo.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  async create(req, res) {
    try {
      const { thumbnailUrl, url } = req.body;

      await delUrlFilesOnRedis(0, thumbnailUrl, url);
      const data = await this.service.create(req.body);

      return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
    } catch (error) {
      return Response.error(
        res,
        { message: errors.WHILE_CREATE.format('video') },
        400
      );
    }
  }

  async get(req, res) {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;

      if (id) {
        const data = await this.service.getVideoById(id);
        return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
        // eslint-disable-next-line no-else-return
      } else {
        // check on query page or limit valid
        // eslint-disable-next-line no-lonely-if
        if (page || limit) {
          const data = await this.service.getListVideo({
            // eslint-disable-next-line radix
            page: parseInt(page || pages.PAGE_DEFAULT),
            // eslint-disable-next-line radix
            limit: parseInt(limit || pages.LIMIT_DEFAULT),
          });

          return Response.success(
            res,
            { docs: data.data, pagination: data.pagination },
            httpCodes.STATUS_OK
          );
          // eslint-disable-next-line no-else-return
        } else {
          const data = await this.service.findAll();
          return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
        }
      }
    } catch (error) {
      console.log(error);
      return Response.error(
        res,
        { message: errors.WHILE_GET.format('video') },
        400
      );
    }
  }

  async getInstructorUploadVideo(req, res) {
    try {
      const { id } = req.params;
      const user = await this.service.getInstructorUploadVideo(id);
      return Response.success(res, { docs: user }, httpCodes.STATUS_OK);
    } catch (error) {
      return Response.error(
        res,
        { message: errors.WHILE_GET.format('instructor upload video') },
        400
      );
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { thumbnailUrl, url } = req.body;
      await delUrlFilesOnRedis(0, thumbnailUrl, url);

      const data = await this.service.update(id, req.body);
      if (data) {
        return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
      }
      return Response.error(
        res,
        { message: errors.WHILE_GET.format('instructor upload video') },
        400
      );
    } catch (error) {
      return Response.error(
        res,
        { message: errors.WHILE_GET.format('instructor upload video') },
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
        { message: errors.WHILE_DELETE.format('video') },
        400
      );
    }
  }
}

export default new VideosController(VideosService);
