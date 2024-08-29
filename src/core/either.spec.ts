import { expect, test } from "vitest";
import { Either, left, right } from "./either";

function doSomething(shuoldSuccess: boolean): Either<string, string> {
    if (shuoldSuccess) {
        return right("sucess");
    } else {
        return left("error");
    }
}

test("success result", () => {
    const result = doSomething(true);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
});

test("error result", () => {
    const result = doSomething(false);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
});
