import { InMemoryQuestionsRepository } from "tests/repositories/in-memory-questions-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { makeQuestion } from "tests/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe("Fetch Recent Questions" , async () => {

    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
    })

    it("Should be able to fetch recent questions", async () => {
        await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date(2022, 0, 20)}))
        await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date(2022, 0, 18)}))
        await inMemoryQuestionsRepository.create(makeQuestion({createdAt: new Date(2022, 0, 23)}))


        const {questions} = await sut.execute({
            page: 1
        })

        expect(questions).toEqual([
            expect.objectContaining({createdAt: new Date(2022, 0, 23)}),
            expect.objectContaining({createdAt: new Date(2022, 0, 20)}),
            expect.objectContaining({createdAt: new Date(2022, 0, 18)}),
        ])
    })

    it("Should be able to fetch paginated recent questions", async () => {

        for(let i = 1; i <= 22; i++){
            await inMemoryQuestionsRepository.create(makeQuestion())
        }

        const {questions} = await sut.execute({
            page: 2
        })

        expect(questions).toHaveLength(2)
    })
})