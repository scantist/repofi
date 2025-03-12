import {  type RepoContributors } from "~/lib/schema"

export function calculateContributorsPercentage(repoContributors:RepoContributors){
  const totalContributions = repoContributors.reduce((acc, curr) => acc + curr.contributions, 0)
  // Implement the logic to calculate the Proof-of-Concept (POC) rewards
  return repoContributors.map(contributor => {
    return{
      id:contributor.id,
      name: contributor.name,
      avatar: contributor.avatar,
      value: contributor.contributions/totalContributions *100
    }
  })
}
