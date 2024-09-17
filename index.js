async function getApi(userName) {
  let promise = await fetch(`https://api.github.com/users/${userName}`);
  let responseData = await promise.json();
  return responseData;
}

function formatDate(isoDateString) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-GB", options);
}

function getCityName(location) {
  const parts = location.split(",");
  return parts[0].trim();
}

// Get the root element
let root = document.documentElement;
let themeText = document.getElementById("theme-text");

function updateDisplay(userData) {
  let alertDiv = document.getElementById("alert");
  let cardDiv = document.getElementById("card");

  let dataColor = dataCssColor;
  let noDataColor = "#90A4AE";

  if (userData.message === "Not Found") {
    alertDiv.classList.remove("alert-info");
    alertDiv.classList.add("alert-warning");
    alertDiv.textContent = `No such user found`;
    alertDiv.style.display = "block";
    cardDiv.style.display = "none";
  } else {
    alertDiv.style.display = "none";
    cardDiv.style.display = "block";
    let userImg = document.getElementById("user-img");
    let userName = document.getElementById("user-name");
    let userNameLink = document.getElementById("user-name-link");
    let dateOfJoining = document.getElementById("date-of-joining");
    let userBio = document.getElementsByClassName("user-bio");
    let userRepos = document.getElementById("user-repos");
    let userFollowers = document.getElementById("user-followers");
    let userFollowing = document.getElementById("user-following");
    let userLocation = document.getElementById("user-location");
    let userTwitter = document.getElementById("user-twitter");
    let userLink = document.getElementById("user-link");
    let userCompany = document.getElementById("user-company");
    let locationIcon = document.getElementById("gps");
    let linkIcon = document.getElementById("link");
    let twitterIcon = document.getElementById("twitter");
    let companyIcon = document.getElementById("company");

    console.log(userData);

    userImg.src = userData.avatar_url;
    userImg.alt = userData.login;
    userName.textContent = userData.name;
    userNameLink.textContent = `@${userData.login}`;
    userNameLink.href = `https://www.github.com/${userData.login}`;
    dateOfJoining.textContent = `Joined ${formatDate(userData.created_at)}`;

    for (let i = 0; i < userBio.length; i++) {
      userBio[i].textContent = userData.bio
        ? userData.bio
        : "This profile has no bio";
    }

    userRepos.textContent = userData.public_repos;
    userRepos.style.color =
      userRepos.textContent !== 0 ? dataColor : noDataColor;
    userFollowers.textContent = userData.followers;
    userFollowers.style.color =
      userFollowers.textContent !== 0 ? dataColor : noDataColor;
    userFollowing.textContent = userData.following;
    userFollowing.style.color =
      userFollowing.textContent !== 0 ? dataColor : noDataColor;
    userLocation.textContent = userData.location
      ? getCityName(userData.location)
      : "Not Available";
    userLocation.style.color =
      userLocation.textContent !== "Not Available" ? dataColor : noDataColor;
    locationIcon.style.color =
      userLocation.textContent !== "Not Available" ? dataColor : noDataColor;
    userTwitter.textContent = userData.twitter_username
      ? userData.twitter_username
      : "Not Available";
    userTwitter.style.color =
      userTwitter.textContent !== "Not Available" ? dataColor : noDataColor;
    twitterIcon.style.color =
      userTwitter.textContent !== "Not Available" ? dataColor : noDataColor;
    userTwitter.style.cursor =
      userTwitter.textContent !== "Not Available" ? "pointer" : "default";
    twitterIcon.style.cursor =
      userTwitter.textContent !== "Not Available" ? "pointer" : "default";
    userLink.textContent = userData.blog ? userData.blog : "Not Available";
    userLink.style.color =
      userLink.textContent !== "Not Available" ? dataColor : noDataColor;
    linkIcon.style.color =
      userLink.textContent !== "Not Available" ? dataColor : noDataColor;
    userLink.style.cursor =
      userLink.textContent !== "Not Available" ? "pointer" : "default";
    linkIcon.style.cursor =
      userLink.textContent !== "Not Available" ? "pointer" : "default";
    userCompany.textContent = userData.company
      ? userData.company
      : "Not Available";
    userCompany.style.color =
      userCompany.textContent !== "Not Available" ? dataColor : noDataColor;
    companyIcon.style.color =
      userCompany.textContent !== "Not Available" ? dataColor : noDataColor;

    if (userTwitter.textContent !== "Not Available") {
      userTwitter.addEventListener("click", clickTwitter);
    } else {
      userTwitter.removeEventListener("click", clickTwitter);
    }
    if (userLink.textContent !== "Not Available") {
      userLink.addEventListener("click", clickLink);
    } else {
      userLink.removeEventListener("click", clickLink);
    }
  }
}

function clickTwitter() {
  let userTwitter = document.getElementById("user-twitter");
  window.open(`https://www.twitter.com/${userTwitter.textContent}`, "_blank");
}

function clickLink() {
  let userLink = document.getElementById("user-link");
  window.open(`${userLink.textContent}`, "_blank");
}

async function getUser() {
  let input = document.getElementById("user-name-search");
  let userData = await getApi(input.value);
  updateDisplay(userData);
}

async function toggleThemeAndIcons() {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let newTheme = currentTheme === "dark" ? "light" : "dark";

  console.log("Previous main text color", dataCssColor);
  console.log("Previous theme", currentTheme);

  // Apply the new theme
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme); // Save the user's preference in localStorage

  dataCssColor = getComputedStyle(root)
    .getPropertyValue("--main-text-color")
    .trim();
  dataColor = dataCssColor;

  console.log("Current main text color", dataCssColor);

  console.log("Current theme", newTheme);

  // Update icon visibility
  let sun = document.getElementById("sun");
  let moon = document.getElementById("moon");

  if (newTheme === "dark") {
    sun.style.display = "block";
    moon.style.display = "none";
    themeText.textContent = "LIGHT";
  } else {
    sun.style.display = "none";
    moon.style.display = "block";
    themeText.textContent = "DARK";
  }

  let input = document.getElementById("user-name-search");
  if (input.value) {
    let userData = await getApi(input.value);
    updateDisplay(userData);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  //   let alertDiv = document.getElementById("alert");
  //   alertDiv.style.display = "block";
  //   alertDiv.classList.add("alert-info");
  //   alertDiv.textContent = "Write a github username to get the stats.";
  //   document.getElementById("card").style.display = "none";

  // Initialize icon visibility
  let sunIcon = document.getElementById("sun");
  let moonIcon = document.getElementById("moon");

  // Apply saved theme or detect system preference
  let savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    // Optionally detect system preference
    let prefersDarkScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    let defaultTheme = prefersDarkScheme ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", defaultTheme);
    localStorage.setItem("theme", defaultTheme);
  }

  dataCssColor = getComputedStyle(root)
    .getPropertyValue("--main-text-color")
    .trim();
  console.log("Current main text color", dataCssColor);

  // Toggle icons based on the current theme
  let currentTheme = document.documentElement.getAttribute("data-theme");
  console.log("Current theme", currentTheme);

  if (currentTheme === "dark") {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
    themeText.textContent = "LIGHT";
  } else {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
    themeText.textContent = "DARK";
  }

  let input = document.getElementById("user-name-search");
  input.textContent = "archielicious";
  input.value = "archielicious";

  let userData = await getApi(input.value);
  console.log(userData);
  updateDisplay(userData);
});

document.getElementById("sun").addEventListener("click", toggleThemeAndIcons);
document.getElementById("moon").addEventListener("click", toggleThemeAndIcons);

let searchButton = document.getElementById("button-addon2");
searchButton.addEventListener("click", getUser);

document
  .getElementById("user-name-search")
  .addEventListener("input", (event) => {
    let inputValue = event.target.value;
    let alertDiv = document.getElementById("alert");
    let cardDiv = document.getElementById("card");
    if (inputValue === "") {
      alertDiv.classList.remove("alert-warning");
      alertDiv.classList.add("alert-info");
      alertDiv.textContent = `Write a github username to get the stats.`;
      alertDiv.style.display = "block";
      cardDiv.style.display = "none";
    }
  });
