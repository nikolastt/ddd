import { beforeEach, describe, expect, it } from "vitest";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { makeAnswerComment } from "tests/factories/make-answer-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentsRepository } from "tests/repositories/in-memory-answers-comments-repository";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment", () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository =
            new InMemoryAnswerCommentsRepository();

        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
    });

    it("Should be able to delete a answer comment", async () => {
        const answerComment = makeAnswerComment();

        inMemoryAnswerCommentsRepository.create(answerComment);

        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        });

        expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
    });

    it("Should not be able to delete another user answer comment", async () => {
        const answerComment = makeAnswerComment({
            authorId: new UniqueEntityID("author-1"),
        });

        inMemoryAnswerCommentsRepository.create(answerComment);

        const result = await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: "author-2",
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
