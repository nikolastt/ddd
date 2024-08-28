import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository";
import { makeAnswer } from "tests/factories/make-answer";
import { InMemoryQuestionsRepository } from "tests/repositories/in-memory-questions-repository";
import { ChoseQuestionBestAnswerUseCase } from "./chose-question-best-answer";
import { makeQuestion } from "tests/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ChoseQuestionBestAnswerUseCase;

describe("Chose Question Best Answer", () => {
    beforeEach(() => {
        inMemoryQuestionRepository = new InMemoryQuestionsRepository();
        inMemoryAnswersRepository = new InMemoryAnswersRepository();
        sut = new ChoseQuestionBestAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryQuestionRepository,
        );
    });

    it("Should be able to choose the question best answer", async () => {
        const question = makeQuestion();
        const answer = makeAnswer({
            questionId: question.id,
        });

        await inMemoryQuestionRepository.create(question);
        await inMemoryAnswersRepository.create(answer);

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString(),
        });

        expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(
            answer.id,
        );
    });

    it("Should not be able to choose another user question best answer", async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityID("author-1"),
        });
        const answer = makeAnswer({
            questionId: question.id,
        });

        await inMemoryQuestionRepository.create(question);
        await inMemoryAnswersRepository.create(answer);

        await expect(() =>
            sut.execute({
                answerId: answer.id.toString(),
                authorId: "author-2",
            }),
        ).rejects.toBeInstanceOf(Error);
    });
});
