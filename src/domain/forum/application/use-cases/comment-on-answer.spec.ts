import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository";
import { makeAnswer } from "tests/factories/make-answer";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { InMemoryAnswerCommentRepository } from "tests/repositories/in-memory-answers-comments-repository";

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment on Answer", () => {
    beforeEach(() => {
        inMemoryAnswerRepository = new InMemoryAnswersRepository();
        inMemoryAnswerCommentsRepository =
            new InMemoryAnswerCommentRepository();
        sut = new CommentOnAnswerUseCase(
            inMemoryAnswerRepository,
            inMemoryAnswerCommentsRepository,
        );
    });

    it("Should be able to comment on answer", async () => {
        const answer = makeAnswer();

        await inMemoryAnswerRepository.create(answer);

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: answer.authorId.toString(),
            content: "Comentário teste",
        });

        expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
            "Comentário teste",
        );
    });
});
