import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryQuestionsRepository } from "tests/repositories/in-memory-questions-repository";
import { makeQuestion } from "tests/factories/make-question";
import { InMemoryQuestionCommentRepository } from "tests/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";

let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on Question", () => {
    beforeEach(() => {
        inMemoryQuestionRepository = new InMemoryQuestionsRepository();
        inMemoryQuestionCommentsRepository =
            new InMemoryQuestionCommentRepository();
        sut = new CommentOnQuestionUseCase(
            inMemoryQuestionRepository,
            inMemoryQuestionCommentsRepository,
        );
    });

    it("Should be able to comment on question", async () => {
        const question = makeQuestion();

        await inMemoryQuestionRepository.create(question);

        await sut.execute({
            questionId: question.id.toString(),
            authorId: question.authorId.toString(),
            content: "Comentário teste",
        });

        expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
            "Comentário teste",
        );
    });
});
