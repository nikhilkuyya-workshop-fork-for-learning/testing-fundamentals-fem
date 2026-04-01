import type { paths } from "@octokit/openapi-types";

type OrgRepoResponse =
  paths["/repos/{owner}/{repo}"]["get"]["responses"]["200"]["content"]["application/json"];
export type Fetch = typeof fetch;
export class GithubApi {
  constructor(private readonly token: string | undefined, private readonly fetch: Fetch, 
    private readonly delay: (x: number) => Promise<void>,
    private readonly timeout: number = 1000
  ) {}

  private getHeaders(): HeadersInit {
    return {
      "User-Agent": "Qwik Workshop",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(this.token ? { Authorization: "Bearer " + this.token } : {}),
    };
  }

  async getRepository(owner: string, repo: string): Promise<OrgRepoResponse> {


    return Promise.race([
      this.fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
          headers: this.getHeaders(),
        },
      ).then(response => response.json()),
      this.delay(this.timeout).then(() => {
        return {
          response: 'timeout',
        }
      }),
    ]);
  }

  async getRepositories(owner: string): Promise<OrgRepoResponse[]> {
    let repositories: OrgRepoResponse[] = [];
    let page = 1;
    while(true) {
      const response = await this.fetch(
        `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}`,
        {
          headers: this.getHeaders(),
        },
      ).then(response => response.json());
      repositories.push(...response);
      if(response.length < 100) {
        break;
      }
      page++;
    }
    return repositories; // return the repositories if the loop is broken
  }
}


export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}