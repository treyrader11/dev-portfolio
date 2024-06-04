import axios from "axios";

export const getLatestRepos = async (data, token) => {
  console.log("data", data);
  try {
    const username = data.githubUsername;

    // let token = `token ${process.env.GITHUB_AUTH_TOKEN}`;
    // console.log("TOKEN", token);

    if (token) {
      const res = await axios.get(
        `https://api.github.com/search/repositories?q=user:${username}+sort:author-date-asc`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      let repos = res.data.items;
      let latestSixRepos = repos.splice(0, 6);
      let latestTwelveRepos = repos.splice(0, 12);
      // console.log("LATEST 6 repos", latestSixRepos);
      return latestTwelveRepos;
    } else {
      const res = await axios.get(
        `https://api.github.com/search/repositories?q=user:${username}+sort:author-date-asc`
      );
      let repos = res.data.items;
      // let latestSixRepos = repos.splice(0, 6);
      let latestTwelveRepos = repos.splice(0, 12);
      return latestTwelveRepos;
    }
  } catch (err) {
    console.log(err);
  }
};
