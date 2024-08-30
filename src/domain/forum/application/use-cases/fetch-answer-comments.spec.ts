import { beforeEach, describe, expect, it } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "tests/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "tests/repositories/in-memory-answers-comments-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-commnets";

let inMemoryQuestoinCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", async () => {
    beforeEach(() => {
        inMemoryQuestoinCommentsRepository =
            new InMemoryAnswerCommentsRepository();
        sut = new FetchAnswerCommentsUseCase(
            inMemoryQuestoinCommentsRepository,
        );
    });

    it("Should be able to fetch answers commnets", async () => {
        await inMemoryQuestoinCommentsRepository.create(
            makeAnswerComment({
                answerId: new UniqueEntityID("answer-1"),
            }),
        );
        await inMemoryQuestoinCommentsRepository.create(
            makeAnswerComment({
                answerId: new UniqueEntityID("answer-1"),
            }),
        );
        await inMemoryQuestoinCommentsRepository.create(
            makeAnswerComment({
                answerId: new UniqueEntityID("answer-1"),
            }),
        );

        const result = await sut.execute({
            answerId: "answer-1",
            page: 1,
        });

        expect(result.isRight()).toBe(true);
        expect(result.value?.answerComments).toHaveLength(3);
    });

    it("Should be able to fetch paginated answer comments", async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestoinCommentsRepository.create(
                makeAnswerComment({
                    answerId: new UniqueEntityID("answer-1"),
                }),
            );
        }

        const result = await sut.execute({
            page: 2,
            answerId: "answer-1",
        });

        expect(result.isRight()).toBe(true);
        expect(result.value?.answerComments).toHaveLength(2);
    });
});
