class GITHUB {
  constructor() {
    this.client_id = "539bafeb77212fbb6386";
    this.client_secret = "705728792c35032fe725ba1665de86edb402eb44";
    this.base = "https://api.github.com/users/";
  }

  async ajaxUser(userValue) {
    const userURL = `${this.base}${userValue}?client_id='${
      this.client_id
    }'&client_secret='${this.client_secret}'`;
    const reposURL = `${this.base}${userValue}/repos?client_id='${
      this.client_id
    }'&client_secret='${this.client_secret}'`;
    // get user
    const userData = await fetch(userURL);
    const user = await userData.json();
    // get repos
    const reposData = await fetch(reposURL);
    const repos = await reposData.json();

    return {
      user,
      repos
    };
  }
}

class UI {
  constructor() {}
  // show feedback
  showFeedback(text) {
    const feedback = document.querySelector(".feedback");
    feedback.classList.add("showItem");
    feedback.innerHTML = `<p>${text}</p>`;
    setTimeout(() => {
      feedback.classList.remove("showItem");
    }, 3000);
  }
  // get user
  getUser(user) {
    const {
      avatar_url: image,
      html_url: link,
      public_repos: repos,
      name,
      login,
      message
    } = user;
    if (message === "Not Found") {
      this.showFeedback("no such user exists. please enter a valid user");
    } else {
      this.displayUser(image, link, repos, name, login);
      const searchUser = document.getElementById("searchUser");
      searchUser.value = "";
    }
  }
  displayUser(image, link, repos, name, login) {
    const usersList = document.getElementById("github-users");
    const div = document.createElement("div");
    div.classList.add("row", "single-user", "my-3");
    div.innerHTML = `<div class=" col-sm-6 col-md-4 user-photo my-2">
       <img src="${image}" class="img-fluid" alt="">
      </div>
      <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
       <h6>name : <span>${name}</span></h6>
       <h6>github : <a href="${link}" target="_blank"class="badge badge-primary">link</a> </h6>
       <h6>public repos : <span class="badge badge-success">${repos}</span> </h6>
      </div>
      <div class=" col-sm-6 col-md-4 user-repos my-2">
       <button type="button" data-id="${login}" id="getRepos" class="btn text-capitalize mt-3 mb-5 reposBtn">
        get repos
       </button>
      </div>
`;
    usersList.appendChild(div);
  }
  displayRepos(userID, repos) {
    const reposBtn = document.querySelectorAll("[data-id]");
    reposBtn.forEach(btn => {
      if (btn.dataset.id === userID) {
        // get parent
        const parent = btn.parentNode;

        //go over repos
        repos.forEach(repo => {
          const p = document.createElement("p");
          p.innerHTML = `<p><a href="${repo.html_url}" target="_blank">${
            repo.name
          }</a></p>`;
          parent.appendChild(p);
        });
      }
    });
  }
}

(function() {
  const ui = new UI();
  const github = new GITHUB();
  const searchForm = document.getElementById("searchForm");
  const searchUser = document.getElementById("searchUser");
  const usersList = document.getElementById("github-users");

  searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const textValue = searchUser.value;

    if (textValue === "") {
      ui.showFeedback("please enter a user");
    } else {
      github.ajaxUser(textValue).then(data => ui.getUser(data.user));
    }
  });
  usersList.addEventListener("click", event => {
    if (event.target.classList.contains("reposBtn")) {
      const userID = event.target.dataset.id;
      github.ajaxUser(userID).then(data => ui.displayRepos(userID, data.repos));
    }
  });
})();
