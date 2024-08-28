import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryQuestionCommentRepository } from "tests/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "tests/factories/make-question-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentRepository();

        sut = new DeleteQuestionCommentUseCase(
            inMemoryQuestionCommentsRepository,
        );
    });

    it("Should be able to delete a question comment", async () => {
        const questionComment = makeQuestionComment();

        inMemoryQuestionCommentsRepository.create(questionComment);

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        });

        expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
    });

    it("Should not be able to delete another user question comment", async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityID("author-1"),
        });

        inMemoryQuestionCommentsRepository.create(questionComment);

        await expect(
            sut.execute({
                questionCommentId: questionComment.id.toString(),
                authorId: "author-2",
            }),
        ).rejects.toBeInstanceOf(Error);
    });
});
