import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswersCommentsRepository {
    create(answerCommnet: AnswerComment): Promise<void>;
    delete(answerCommnet: AnswerComment): Promise<void>;
    findManyByAnswerId(
        answerId: string,
        params: PaginationParams,
    ): Promise<AnswerComment[]>;
    findById(id: string): Promise<AnswerComment | null>;
}
