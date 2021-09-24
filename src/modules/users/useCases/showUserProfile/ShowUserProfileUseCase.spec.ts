import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: InMemoryUsersRepository;

describe("View user profile", () => {

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  })

  it("Should be able to show the user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "joseph",
      email: "joseph@gmail.com",
      password: "1234"
    });

    const userProfile =
    await showUserProfileUseCase.execute(user.id as string);
    expect(userProfile).toEqual(user);
  });

  it("Should not be able to show the user profile when user doesn't exists", async () => {

    expect(async () => {
      await showUserProfileUseCase.execute("skjfaklsdjfa");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

})
