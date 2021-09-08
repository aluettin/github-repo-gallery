// div where profile info will appear
const profileInfo = document.querySelector(".overview");
const username = "aluettin";
const repoList = document.querySelector(".repo-list");
const repoSection = document.querySelector(".repos");
const repoDataSection = document.querySelector(".repo-data");
// Select Back to Repo Gallery button
const viewReposButton = document.querySelector(".view-repos");

const filterInput = document.querySelector(".filter-repos");

// Fetch user data
const getProfile = async function () {
  const profile = await fetch(`https://api.github.com/users/${username}`);
  const userInfo = await profile.json();
  //console.log(userInfo);

  displayUserInfo(userInfo);
};

getProfile();

// Display user data
const displayUserInfo = function(data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML =
  `<figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>`;
  profileInfo.append(div);
};

// Fetch repos
const getRepos = async function () {
  const sortedRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await sortedRepos.json();
  displayRepos(repoData);
};

getRepos();

// Display all repos
const displayRepos = function (repos) {
  //Show search box
  filterInput.classList.remove("hide");

  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    getRepoInfo(repoName);
  }
});

const getRepoInfo = async function (repoName) {
  const getInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await getInfo.json();
  // console.log(repoInfo);

  // Grab languages
  const getLanguages = await fetch(repoInfo.languages_url);
  const languageData = await getLanguages.json();
  // console.log(languageData);

  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  }
  // console.log(languages);

  displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
  viewReposButton.classList.remove("hide");
  repoDataSection.innerHTML = "";
  repoDataSection.classList.remove("hide");
  repoSection.classList.add("hide");
  const div = document.createElement("div");
  div.innerHTML =
  `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

  repoDataSection.append(div);
};

// Add click event to Back to Repo Gallery button
  viewReposButton.addEventListener("click", function () {
    repoSection.classList.remove("hide");
    repoDataSection.classList.add("hide");
    viewReposButton.classList.add("hide");
  });

// Add input event to search box
filterInput.addEventListener("input", function (e) {
  const searchInput = e.target.value;
  // console.log(searchInput);
  const repos = document.querySelectorAll(".repo");
  const lowerCaseInput = searchInput.toLowerCase();

  repos.forEach(function (repo) {
    const lowerCaseRepo = repo.innerText.toLowerCase();
    if (lowerCaseRepo.includes(lowerCaseInput)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  });
});
