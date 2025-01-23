import { it } from "@jest/globals";
import { zip } from "../helpers/zip";

it("zip", () => {
    const foo = [1,2,3,4]
    const bar = ["a", "b", "c", "d"]

    const expected = [
      [1,"a"],
      [2, "b"],
      [3, "c"],
      [4, "d"]
    ]

    expect(zip(foo, bar)).toEqual(expected)

})