import { beforeEach, describe, expect, it } from "vitest";
import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository";

let inMemoryAnswerQuestionRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Create Answer", () => {
    beforeEach(() => {
        inMemoryAnswerQuestionRepository = new InMemoryAnswersRepository();
        sut = new AnswerQuestionUseCase(inMemoryAnswerQuestionRepository);
    });

    it("Should be able to create an answer", async () => {
        const result = await sut.execute({
            content: "New answer",
            instructorId: "1",
            questionId: "1",
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryAnswerQuestionRepository.items[0]).toEqual(
            result.value?.answer,
        );
    });
});
