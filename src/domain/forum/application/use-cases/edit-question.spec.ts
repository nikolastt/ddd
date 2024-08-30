import { beforeEach, describe, expect, it } from "vitest";
import { EditQuestionUseCase } from "./edit-question";
import { InMemoryQuestionsRepository } from "tests/repositories/in-memory-questions-repository";
import { makeQuestion } from "tests/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
    });

    it("Should be able to edit a question", async () => {
        const newQuestion = makeQuestion(
            {
                authorId: new UniqueEntityID("author-1"),
            },
            new UniqueEntityID("question-1"),
        );

        await inMemoryQuestionsRepository.create(newQuestion);

        await sut.execute({
            questionId: "question-1",
            authorId: "author-1",
            title: "New Title",
            content: "New Content",
        });

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: "New Title",
            content: "New Content",
        });
    });

    it("Should not be able to edit a question from another user", async () => {
        const newQuestion = makeQuestion(
            {
                authorId: new UniqueEntityID("author-1"),
            },
            new UniqueEntityID("question-1"),
        );

        await inMemoryQuestionsRepository.create(newQuestion);

        const result = await sut.execute({
            questionId: "question-1",
            authorId: "author-2",
            title: "New Title",
            content: "New Content",
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
