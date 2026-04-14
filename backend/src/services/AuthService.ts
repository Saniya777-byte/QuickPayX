import User from "../models/User";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken";

class AuthService {
  async registerUser(data: any) {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  async loginUser(data: any) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id.toString());

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    };
  }
}

export default new AuthService();