import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get statement operration", () => {

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository,statementRepository);
  })


  it("Should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "joseph",
      email: "joseph@gmail.com",
      password: "1234"
    });
    const user_id = user.id as string;
    const stat = await createStatementUseCase.execute({
      user_id,
      amount : 10,
      type: OperationType.DEPOSIT,
      description: "HELLO MAREVELIOUS WORLD"
    });

    expect(stat).toHaveProperty("id");
  });

  it("Should not be able to get statement operation when user doesn't exists", async () => {
    expect(async () => {
      const user_id = "lksdjfa";
      const stat = await createStatementUseCase.execute({
        user_id,
        amount : 10,
        type: OperationType.DEPOSIT,
        description: "HELLO MAREVELIOUS WORLD"
      });

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: stat.id as string,
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get statement operation when statement doesnt exists", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "joseph",
        email: "joseph@gmail.com",
        password: "1234"
      });
      const user_id = user.id as string;
      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "ksladjf"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
