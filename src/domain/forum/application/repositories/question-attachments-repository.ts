import { QuestionAttachment } from "../../enterprise/entities/question-attachment";

export interface QuestionAttachmentsRepository {
    findManyByQuestionId(quesitonId: string): Promise<QuestionAttachment>;
}
