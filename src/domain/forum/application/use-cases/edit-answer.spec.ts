import { beforeEach, describe, expect, it } from "vitest";
import { EditAnswerUseCase } from "./edit-answer";
import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository";
import { makeAnswer } from "tests/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository();
        sut = new EditAnswerUseCase(inMemoryAnswersRepository);
    });

    it("Should be able to edit a answer", async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityID("author-1"),
            },
            new UniqueEntityID("answer-1"),
        );

        await inMemoryAnswersRepository.create(newAnswer);

        await sut.execute({
            answerId: "answer-1",
            authorId: "author-1",
            content: "New Content",
        });

        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: "New Content",
        });
    });

    it("Should not be able to edit a answer from another user", async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityID("author-1"),
            },
            new UniqueEntityID("answer-1"),
        );

        await inMemoryAnswersRepository.create(newAnswer);

        const result = await sut.execute({
            answerId: "answer-1",
            authorId: "author-2",
            content: "New Content",
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
