import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken";
import { UserRepository } from "../repositories/UserRepository";
import { WalletRepository } from "../repositories/WalletRepository";
import { IRegisterRequest, ILoginRequest, IAuthResponse } from "../types";

class AuthService {
  private userRepository = new UserRepository();
  private walletRepository = new WalletRepository();

  async registerUser(data: IRegisterRequest): Promise<IAuthResponse> {
    const { name, email, password } = data;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      bankBalance: 10000,
    });

    // Create wallet for the user with 10000 balance
    await this.walletRepository.setBalance(user.id!, 10000);

    const token = generateToken(user.id!.toString());

    return {
      id: user.id!.toString(),
      name: user.name,
      email: user.email,
      token,
    };
  }

  async loginUser(data: ILoginRequest): Promise<IAuthResponse> {
    const { email, password } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id!.toString());

    return {
      id: user.id!.toString(),
      name: user.name,
      email: user.email,
      token,
    };
  }
}

export default new AuthService();