import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Authenticate user", () => {

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("Should be able to authenticate an existing user", async () => {
    await createUserUseCase.execute({
      name: "joseph",
      email: "joseph@gmail.com",
      password: "1234"
    })

    const user = await authenticateUserUseCase.execute({
      email: "joseph@gmail.com",
      password: "1234"
    });

    expect(user).toHaveProperty("user.id");
  });

  it("Should not be able to authenticate a non existing user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "joseph@gmail.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
