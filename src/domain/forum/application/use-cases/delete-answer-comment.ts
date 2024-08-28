import { Either, left, right } from "@/core/either";
import { AnswersCommentsRepository } from "../repositories/answer-comments-repository";

interface DeleteAnswerCommentUseCaseRequest {
    authorId: string;
    answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<string, {}>;

export class DeleteAnswerCommentUseCase {
    constructor(private answerCommentsRepository: AnswersCommentsRepository) {}

    async execute({
        authorId,
        answerCommentId,
    }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
        const answerComment =
            await this.answerCommentsRepository.findById(answerCommentId);

        if (!answerComment) {
            return left("Answer comment not found");
        }

        if (answerComment.authorId.toString() !== authorId) {
            return left("Not allowed");
        }

        await this.answerCommentsRepository.delete(answerComment);

        return right({});
    }
}
