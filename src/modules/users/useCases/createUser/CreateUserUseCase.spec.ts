import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create a new user", () => {

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "joseph",
      email: "joseph@gmail.com",
      password: "1234"
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a new user with the same email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "joseph",
        email: "joseph@gmail.com",
        password: "1234"
      });
      await createUserUseCase.execute({
        name: "joseph",
        email: "joseph@gmail.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
})
