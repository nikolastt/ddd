import { beforeEach, describe, expect, it } from "vitest";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "tests/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "tests/repositories/in-memory-question-comments-repository";

let inMemoryQuestoinCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments", async () => {
    beforeEach(() => {
        inMemoryQuestoinCommentsRepository =
            new InMemoryQuestionCommentsRepository();
        sut = new FetchQuestionCommentsUseCase(
            inMemoryQuestoinCommentsRepository,
        );
    });

    it("Should be able to fetch questions commnets", async () => {
        await inMemoryQuestoinCommentsRepository.create(
            makeQuestionComment({
                questionId: new UniqueEntityID("question-1"),
            }),
        );
        await inMemoryQuestoinCommentsRepository.create(
            makeQuestionComment({
                questionId: new UniqueEntityID("question-1"),
            }),
        );
        await inMemoryQuestoinCommentsRepository.create(
            makeQuestionComment({
                questionId: new UniqueEntityID("question-1"),
            }),
        );

        const result = await sut.execute({
            questionId: "question-1",
            page: 1,
        });

        expect(result.isRight()).toBe(true);
        expect(result.value?.questionComments).toHaveLength(3);
    });

    it("Should be able to fetch paginated question comments", async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestoinCommentsRepository.create(
                makeQuestionComment({
                    questionId: new UniqueEntityID("question-1"),
                }),
            );
        }

        const result = await sut.execute({
            page: 2,
            questionId: "question-1",
        });

        expect(result.isRight()).toBe(true);
        expect(result.value?.questionComments).toHaveLength(2);
    });
});
