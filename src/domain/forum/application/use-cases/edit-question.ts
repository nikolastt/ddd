import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";

interface EditQuestionUseCaseRequest {
    authorId: string;
    questionId: string;
    title: string;
    content: string;
    attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        question: Question;
    }
>;

export class EditQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionAttachmentsRepository: QuestionAttachmentsRepository,
    ) {}

    async execute({
        authorId,
        questionId,
        content,
        title,
        attachmentsIds,
    }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);

        if (!question) {
            return left(new ResourceNotFoundError());
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError());
        }

        const currenteQuestionAttachments =
            await this.questionAttachmentsRepository.findManyByQuestionId(
                questionId,
            );

        question.title = title;
        question.content = content;

        await this.questionsRepository.save(question);

        return right({
            question,
        });
    }
}
