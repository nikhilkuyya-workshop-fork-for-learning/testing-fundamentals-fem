import {  test, expect } from "@playwright/test";

test.describe("Welcome page", () => {

    test("should have title has Welcome to Qwik", async ({page}) => {
        await page.goto("http://localhost:5173")
        await expect(page).toHaveTitle("Welcome to Qwik");
    });

});