import { UsersService } from "./";
import jwt from "helpers/jwt";
import bcrypt from "bcryptjs";
import { userSignupResponse } from "commons/responses";
import db from "models";

class AuthService {
  constructor(UsersService, model) {
    this.usersService = UsersService;
    this.signUp = this.signUp.bind(this);
    this.model = model;
  }

  async signUp(data) {
    const { email, password } = data;

    const userEmail = await this.usersService.getUserByEmail(email);

    if (userEmail) {
      throw new Error("User already exists");
    }

    const saltLength = 10;
    const hashedPassword = await bcrypt.hash(password, saltLength);

    const user = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    return new userSignupResponse(user);
  }

  async signIn({ email, password }) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new Error("User does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Incorrect password");
    }

    const token = jwt.sign({ id: user.id });

    return { token };
  }
}

export default new AuthService(UsersService, db.OauthAccessToken);
