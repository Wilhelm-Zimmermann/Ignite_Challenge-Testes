import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "./CreateStatementController";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create a new statement", () => {

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementRepository);
  })


  it("Should be able to create a new statement for user", async () => {
    const user = await createUserUseCase.execute({
      name: "joseph",
      email: "joseph@gmail.com",
      password: "1234"
    });
    const user_id = user.id as string;

    const stat = await createStatementUseCase.execute({
      user_id,
      amount: 1,
      type: OperationType.DEPOSIT,
      description:" hello WOrld"
    })
    expect(stat).toHaveProperty("id");
  });

  it("Should not be able to create a new statement for a non existing user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id:"lkdsjaf",
        amount: 1,
        type: OperationType.DEPOSIT,
        description:" hello WOrld"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
})
