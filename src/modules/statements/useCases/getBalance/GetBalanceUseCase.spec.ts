import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";



let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let getStatementUseCase: GetBalanceUseCase;

describe("Get User balance", () => {

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    getStatementUseCase = new GetBalanceUseCase(statementRepository, usersRepository);
  })


  it("Should be able to get user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "joseph",
      email: "joseph@gmail.com",
      password: "1234"
    });
    const user_id = user.id as string;
    const stat = await getStatementUseCase.execute({
      user_id
    });
    expect(stat).toHaveProperty("balance");
  });

  it("Should not be able to get user balance when user doesn't exists", async () => {
    expect(async () => {
      const stat = await getStatementUseCase.execute({
        user_id: "asidjfoçijdas"
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
