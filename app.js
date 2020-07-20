class GITHUB {
  constructor() {
    this.client_id = "aa6a39ca88665900f082";
    this.client_secret = "9ca1406bc6e5577446402c739de616b3b671f1b5";
    this.base = "https://api.github.com/users/";
  }
  async ajaxUser(userValue) {
    //user url
    const userURL = `${this.base}${userValue}?client_id='${this.client_id}'&client_secret='${this.client_secret}'`;
    //repos url
    const reposURL = `${this.base}${userValue}/repos?client_id='${this.client_id}'&client_secret='${this.client_secret}'`;

    // get users
    const userData = await fetch(userURL);
    const user = await userData.json();
    //get repos
    const reposData = await fetch(reposURL);
    const repos = await reposData.json();

    return {
      user,
      repos,
    };
  }
}

class UI {
  constructor() {}
  //show feedback
  showFeedback(text) {
    const feedback = document.querySelector(".feedback");
    feedback.classList.add("showItem");
    feedback.innerHTML = `<p>${text}</p>`;
    setTimeout(() => {
      feedback.classList.remove("showItem");
    }, 3000);
  }
  //get user
  getUser(user) {
    const {
      avatar_url: image,
      html_url: link,
      public_repos: repos,
      name,
      login,
      message,
    } = user;
    if (message === "Not Found") {
      this.showFeedback("no such user exists,please enter a valid value");
    } else {
      this.displayUser(image, link, repos, name, login);
      const searchUser = document.getElementById("searchUser");
      searchUser.value = "";
    }
  }
  displayUser(image, link, repos, name, login) {
    const usersList = document.getElementById("github-users");
    const div = document.createElement("div");
    div.classList.add("single-user");
    div.innerHTML = `
   <div class="user-photo">
       <img src="${image}" class="img-user" alt="">
      </div>
      <div class="user-info">
       <h6>name : <span>${name}</span></h6>
       <h6>github : <a href="${link}" target="_blank"class="badge">link</a> </h6>
       <h6>public repos : <span class="badge">${repos}</span> </h6>
      </div>
      <div class="user-repos">
       <button type="button" data-id='${login}' id="getRepos" class="btn reposBtn">
        get repos
       </button>
      </div> `;
    usersList.appendChild(div);
  }
  displayRepos(userID, repos) {
    const reposBtn = document.querySelectorAll("[data-id]");
    reposBtn.forEach((btn) => {
      if (btn.dataset.id === userID) {
        const parent = btn.parentNode;

        repos.forEach((repo) => {
          const p = document.createElement("p");
          p.innerHTML = `<p class="reposList"><a href='${repos.html_url}' target='_blank'>${repo.name}</a></p>`;
          parent.appendChild(p);
        });
      }
    });
  }
}

(function () {
  const ui = new UI();
  const github = new GITHUB();

  const searchForm = document.getElementById("searchForm");
  const searchUser = document.getElementById("searchUser");
  const userList = document.getElementById("github-users");

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const textValue = searchUser.value;

    if (textValue === "") {
      ui.showFeedback("please enter the user");
    } else {
      github
        .ajaxUser(textValue)
        .then((data) => ui.getUser(data.user))
        .catch((error) => console.log(error));
    }
  });
  //
  userList.addEventListener("click", (event) => {
    if (event.target.classList.contains("reposBtn")) {
      const userID = event.target.dataset.id;
      github
        .ajaxUser(userID)
        .then((data) => ui.displayRepos(userID, data.repos))
        .catch((error) => console.log(error));
    }
  });
})();
