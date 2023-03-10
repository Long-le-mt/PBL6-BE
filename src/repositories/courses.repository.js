import db from 'models';
import { QueryTypes } from 'sequelize';
import logger from 'configs/winston.config';
import { errors } from 'constants';
import BaseRepository from 'commons/base.repository';

const { Course } = db;

export class CoursesRepository extends BaseRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(model) {
    super(model);
  }

  // eslint-disable-next-line class-methods-use-this
  async searchCourses(isAdmin, condition) {
    try {
      const subQuery = isAdmin
        ? ''
        : `Users."isActivated" != 'false' AND Courses."isActived" != 'false' AND Courses."isPublic" != 'false' AND `;
      let query = ` SELECT
                        DISTINCT ON (id) Courses."id",  
                        Courses."name",
                        Courses."price",
                        Courses."thumbnailUrl",
                        Courses."description",
                        Courses."isActived",
                        Courses."userId",
                        Courses."categoryTopicId",
                        Courses."createdAt",
                        Courses."updatedAt",
                        Courses."deletedAt"
                    FROM public."Courses" AS Courses 
                        LEFT JOIN public."CategoryTopics" AS CategoryTopics ON 
                                                                            CategoryTopics."id" = Courses."categoryTopicId"
                        LEFT JOIN public."CourseHashtags" AS CourseHashtags ON
                                                                            CourseHashtags."courseId" = Courses."id"
                        LEFT JOIN public."Hashtags" AS Hashtags ON
                                                                Hashtags.id = CourseHashtags."hashtagId"
                        LEFT JOIN public."Users" as Users ON
                                                          Users.id = Courses."userId"
                    WHERE
                        ${subQuery}
                        (Courses."name" ILIKE :key OR 
                        COALESCE(Courses."description", '') ILIKE :key)`;

      if (condition.category.length) {
        query = `${query} AND CategoryTopics."name" IN (:category)`;
      }

      if (condition.hashtag.length) {
        query = `${query} AND COALESCE(Hashtags."name", '') IN (:hashtag)`;
      }

      const courses = await db.sequelize.query(
        `${query} AND Courses."price" BETWEEN :lteq AND :gteq ORDER BY Courses."id" LIMIT :limit OFFSET :offset`,
        {
          logging: console.log,
          replacements: { ...condition },
          type: QueryTypes.SELECT,
        }
      );

      return courses;
    } catch (error) {
      logger.error(`${errors.ERR_WHITE_SEARCH_COURSE_AT_REPO} - ${error}`);

      throw new Error(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async countResultFromSearchCourses(isAdmin, condition) {
    try {
      const subQuery = isAdmin
        ? ''
        : `Users."isActivated" != 'false' AND Courses."isActived" != 'false' AND Courses."isPublic" != 'false' AND `;
      let query = ` SELECT
                        COUNT (DISTINCT Courses."id")
                    FROM public."Courses" AS Courses 
                        LEFT JOIN public."CategoryTopics" AS CategoryTopics ON 
                                                                            CategoryTopics."id" = Courses."categoryTopicId"
                        LEFT JOIN public."CourseHashtags" AS CourseHashtags ON
                                                                            CourseHashtags."courseId" = Courses."id"
                        LEFT JOIN public."Hashtags" AS Hashtags ON
                                                                Hashtags.id = CourseHashtags."hashtagId"
                        LEFT JOIN public."Users" as Users ON
                                                          Users.id = Courses."userId"
                    WHERE 
                        ${subQuery}
                        (Courses."name" ILIKE :key OR 
                        COALESCE(Courses."description", '') ILIKE :key)`;

      if (condition.category.length) {
        query = `${query} AND CategoryTopics."name" IN (:category)`;
      }

      if (condition.hashtag.length) {
        query = `${query} AND COALESCE(Hashtags."name", '') IN (:hashtag)`;
      }
      const count = await db.sequelize.query(
        `${query} AND Courses."price" BETWEEN :lteq AND :gteq`,
        {
          logging: console.log,
          replacements: { ...condition },
          type: QueryTypes.SELECT,
        }
      );

      return Number(count[0].count);
    } catch (error) {
      logger.error(`${errors.ERR_WHITE_COUNT_COURSE_AT_REPO} - ${error}`);

      throw new Error(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getUserAttendanceCourseYear(id, year) {
    try {
      const query = ` SELECT 
                        DATE_PART('month', Month_Range."month"::date) AS month, count(j.id) AS attendance
                    FROM
                      ( SELECT '2013-01-01' AS month
                        UNION SELECT '2013-02-01' AS month
                        UNION SELECT '2013-03-01' AS month
                        UNION SELECT '2013-04-01' AS month
                        UNION SELECT '2013-05-01' AS month
                        UNION SELECT '2013-06-01' AS month
                        UNION SELECT '2013-07-01' AS month
                        UNION SELECT '2013-08-01' AS month
                        UNION SELECT '2013-09-01' AS month
                        UNION SELECT '2013-10-01' AS month
                        UNION SELECT '2013-11-01' AS month
                        UNION SELECT '2013-12-01' AS month
                      ) AS Month_Range
                    LEFT JOIN "JSubscribes" j ON 
                                                DATE_PART('month', j."createdAt") = DATE_PART('month', Month_Range."month"::date) AND
                                                j."courseId" = :id AND
                                                DATE_PART('year', j."createdAt") = :year
                    GROUP BY month
                    ORDER by month`;

      const data = await db.sequelize.query(query, {
        logging: console.log,
        replacements: { id, year },
        type: QueryTypes.SELECT,
      });

      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async countAllCourse() {
    try {
      const data = await this.model.count({ paranoid: false });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async sumAllRevenueOfAllSoldCourse() {
    try {
      const query = `SELECT
                          SUM(c.price)
                       FROM
                          "JSubscribes" j
                       INNER JOIN "Courses" c ON j."courseId" = c.id`;

      const data = await db.sequelize.query(query, {
        logging: console.log,
        type: QueryTypes.SELECT,
      });

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async countCoursesOfInstructor(userId, isDeleted = false) {
    try {
      const total = await this.model.count({
        where: {
          userId,
        },
        paranoid: !isDeleted,
      });

      return total;
    } catch (error) {
      throw new Error(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async checkUserFinishCourse(userId, courseId) {
    try {
      const query = `SELECT
                          (
                            SELECT
                                  arr_view.set_section
                            FROM
                            (
                              SELECT
                                    s."courseId" ,
                                    array_agg(s.id) as set_section
                              FROM "Sections" s
                              INNER JOIN "SectionViews" sv ON
                                                            sv."sectionId" = s.id
                              WHERE
                                  "userId" = :userId AND 
                                  s."courseId" = :courseId
                              GROUP BY s."courseId" 
                            ) AS arr_view
                          ) @> (
                                SELECT
                                      arr_base.set_section
                                FROM
                                (
                                  SELECT
                                        c.id,
                                        array_agg(distinct s.id) as set_section
                                  FROM "Courses" c
                                  INNER JOIN "Sections" s ON
                                                          s."courseId" = c.id
                                  INNER JOIN "Videos" v ON
                                                          s.id = v."sectionId"
                                  WHERE
                                      c.id = :courseId
                                  GROUP BY c.id
                                ) AS arr_base
                              ) AS check_done`;

      const data = await db.sequelize.query(query, {
        logging: console.log,
        replacements: { userId, courseId },
        type: QueryTypes.SELECT,
      });

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getTop10HighestCourse() {
    try {
      const query = `SELECT 
                          c."id", c."name", COUNT(c.id) AS "total" 
                     FROM "Courses" c 
                     INNER JOIN "JSubscribes" j ON 
                                                j."courseId"  = c.id 
                     GROUP BY(c.id)
                     ORDER BY "total" desc 
                     LIMIT 10`;

      const data = await db.sequelize.query(query, {
        logging: console.log,
        type: QueryTypes.SELECT,
      });

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new CoursesRepository(Course);
