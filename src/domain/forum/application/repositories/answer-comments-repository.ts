import { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswersCommentsRepository {
    create(answerCommnet: AnswerComment): Promise<void>;
    delete(answerCommnet: AnswerComment): Promise<void>;
    findById(id: string): Promise<AnswerComment | null>;
}
