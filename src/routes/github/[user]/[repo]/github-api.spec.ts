import { beforeEach, describe, it, vi, MockInstance} from "vitest";
import { delay, Fetch, GithubApi } from "./github-api";

describe("GithubApi", () => {
    
    let mockFetch: MockInstance<Parameters<Fetch>, ReturnType<Fetch>>;
    let mockDelay: MockInstance<[number],Promise<void>>;
    let githubApi: GithubApi;

    beforeEach(() => {
        mockFetch = vi.fn<Parameters<Fetch>, ReturnType<Fetch>>(mockPromise);
        mockDelay = vi.fn<[number],Promise<void>>(mockPromise);
        githubApi = new GithubApi("TOKEN", mockFetch as any, mockDelay as any);
    })
    describe("getRepository", () => {

        it('should get the repository name', async ({ expect }) => {
            const repository = githubApi.getRepository("USERNAME", "REPO");

            expect(mockFetch).toHaveBeenCalledWith(
                "https://api.github.com/repos/USERNAME/REPO",
                {
                    headers: {
                        "User-Agent": "Qwik Workshop",
                        "X-GitHub-Api-Version": "2022-11-28",
                        Authorization: "Bearer TOKEN"
                    },
                },
            );
            mockFetch.mock.results[0].value.resolve(new Response(JSON.stringify({ name: "REPO" })));
            const response = await repository;
            expect(response.name).toEqual("REPO");
        });
        
        it('should timeout if failed to fetch the response in time', async ({ expect }) => {
            
            const repository = githubApi.getRepository("USERNAME", "REPO");
            expect(mockFetch).toHaveBeenCalledWith(
                "https://api.github.com/repos/USERNAME/REPO",
                {
                    headers: {
                        "User-Agent": "Qwik Workshop",
                        "X-GitHub-Api-Version": "2022-11-28",
                        Authorization: "Bearer TOKEN"
                    },
                },
            );
            expect(mockDelay).toHaveBeenCalledWith(1000);
            mockDelay.mock.results[0].value.resolve();
            const response = await repository;
            expect(response).toEqual({
                response: 'timeout',
            });
        });

    });

    describe('getRepositories', () => {

        it('should get the all the responsitories by calling the api', async ({ expect }) => {
            const repositories = githubApi.getRepositories("USERNAME");
            expect(mockFetch).toHaveBeenNthCalledWith(
                1,
                "https://api.github.com/users/USERNAME/repos?per_page=100&page=1",
                expect.any(Object),
            );                        
            mockFetch.mock.results[0].value.resolve(new Response(JSON.stringify([{ name: "REPO1" }, { name: "REPO2" } ])));
            const response = await repositories;
            expect(response).toEqual([{ name: "REPO1" }, { name: "REPO2" } ]);
        });

        it("should call the api multiple times if the response is more than 100 repositories", async ({ expect }) => {
            const repositories = githubApi.getRepositories("USERNAME");
            expect(mockFetch).toHaveBeenNthCalledWith(
                1,
                "https://api.github.com/users/USERNAME/repos?per_page=100&page=1",
                expect.any(Object),
            );
            const response1 = new Array(100).fill(0).map((_, index) => ({ name: `REPO${index + 1}` }));
            mockFetch.mock.results[0].value.resolve(new Response(JSON.stringify(response1)));
            await delay(0);
            expect(mockFetch).toHaveBeenNthCalledWith(
                2,
                "https://api.github.com/users/USERNAME/repos?per_page=100&page=2",
                expect.any(Object),
            );
            mockFetch.mock.results[1].value.resolve(new Response(JSON.stringify([{ name: "REPO101" }, { name: "REPO102" } ])));
            const response = await repositories;
            expect(response).toEqual([...response1, { name: "REPO101" }, { name: "REPO102" } ]);
        });
    })
});

function mockPromise<T>() : Promise<T> & { resolve: (value: any) => void; reject: (reason?: any) => void } {
    let resolve!: (value: any) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    }) as Promise<Response> & { resolve: (value: any) => void; reject: (reason?: any) => void };
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
}