import { UsersService } from 'services';
import Response from 'helpers/response';
import { httpCodes, errors } from 'constants';

class UsersController {
  constructor(service) {
    this.service = service;
    this.getCourses = this.getCourses.bind(this);
  }

  async getCourses(req, res) {
    try {
      // id of instructor
      const { id } = req.params;
      const data = await this.service.findCourseByInstructor(id);
      return Response.success(res, { docs: data }, httpCodes.STATUS_OK);
    } catch (error) {
      return Response.error(res, errors.WHILE_GET.format('courses'), 400);
    }
  }
}

export default new UsersController(UsersService);
