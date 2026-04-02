import { test, expect, Page } from "@playwright/test";
test.describe("Clustering Page", () => {
    let clusteringPage: ClusteringPage;
    test.beforeEach(async ({ page }) => {
        clusteringPage = new ClusteringPage(page);
        await clusteringPage.goto();
    });


    test("should have title has Clustering", async ({ }) => {
        await expect(clusteringPage.page).toHaveTitle("Chicago Traffic Accidents Clustering")
    })

    test("should fill the form with query Parameters", async ({ }) => {
        const queryParams = { size: "1000", distance: "100", minClusterSize: "3" };
        await clusteringPage.gotoWithQueryParams(queryParams);
        expect(await clusteringPage.sizeInput).toHaveValue("1000");
        expect(await clusteringPage.distanceInput).toHaveValue("100");
        expect(await clusteringPage.minClusterSizeInput).toHaveValue("3");
    })

    test("should also show the cluster in text", async ({ }) => {
        const queryParams = { size: "9999", distance: "99", minClusterSize: "7" };
        await clusteringPage.gotoWithQueryParams(queryParams);
        await expect(await clusteringPage.size).toHaveText("9999");
        await expect(await clusteringPage.distance).toHaveText("99");
        await expect(await clusteringPage.minClusterSize).toHaveText("7");
    })
})

class ClusteringPage {
    constructor(public page: Page) {
    }

    async goto() {
        return await this.page.goto("http://localhost:5173/clustering");
    }

    async gotoWithQueryParams(queryParams: Record<string, string>) {

        return await this.page.goto(
            `http://localhost:5173/clustering?${new URLSearchParams(queryParams).toString()}`
        );
    }

    get size() {
        return this.page.locator("span.size");
    }

    get distance() {
        return this.page.locator("span.distance");
    }

    get minClusterSize() {
        return this.page.locator("span.min-cluster-size");
    }

    get sizeInput() {
        return this.page.locator('input[name="size"]');
    }

    get distanceInput() {
        return this.page.locator('input[name="distance"]');
    }

    get minClusterSizeInput() {
        return this.page.locator('input[name="minClusterSize"]');
    }


}