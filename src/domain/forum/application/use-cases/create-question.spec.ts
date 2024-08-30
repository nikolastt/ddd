import { beforeEach, describe, expect, it } from "vitest";
import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionsRepository } from "tests/repositories/in-memory-questions-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
        sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
    });

    it("should be able to create a question", async () => {
        const result = await sut.execute({
            authorId: "1",
            content: "Question example",
            title: "Question",
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryQuestionsRepository.items[0]).toEqual(
            result.value?.question,
        );
    });
});
