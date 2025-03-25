let currentPage = 1;
let lastPage = 1;

// Load posts when the page starts
document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();
  setupUi();
});

//Infinite Scroll
window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    fetchPosts(false, currentPage);
  }
});
// Get Posts
function fetchPosts(reload = true, page = 1) {
  axios.get(`${baseURL}/posts?limit=10&page=${page}`).then((response) => {
    let posts = response.data.data;

    lastPage = response.data.meta.last_page;

    if (reload) {
      document.getElementById("posts").innerHTML = "";
    }

    for (let post of posts) {
      let author = post.author;
      let postTitle = post.title ? post.title : "";
      let tagsContent = post.tags
        .map(
          (tag) => `
        <button class="btn btn-sm rounded-5" style="background-color:gray; color: white;">
          ${tag.name}
        </button>`
        )
        .join("");

      let postContent = `
        <div class="card shadow my-4">
          <div class="card-header">
            <img src="${author.profile_image}" alt="user" width="40" height="40"
              class="rounded-circle border border-3" />
            <b>${author.username}</b>
          </div>
          <div class="card-body" onclick="postClicked(${post.id})">
            <div class="image-container">
              <img src="${post.image}" alt="post" />
            </div>
            <h6 class="mt-1 text-secondary">${post.created_at}</h6>
            <h4>${postTitle}</h4>
            <p>${post.body}</p>
            <hr />
            <div>
              <i class="bi bi-pencil-square"></i>
              <span>(${post.comments_count}) Comments ${tagsContent}</span>
            </div>
          </div>
        </div>
      `;

      document.getElementById("posts").innerHTML += postContent;
    }
  });
}

// Create New Post
function createNewPostClicked() {
  let title = document.getElementById("post-title-input").value;
  let body = document.getElementById("post-body-input").value;
  let image = document.getElementById("post-image-input").files[0];

  let url = `${baseURL}/posts`;

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  let token = localStorage.getItem("Token");
  let headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  axios
    .post(url, formData, { headers })
    .then((response) => {
      hideModal("create-post-modal");
      showAlert("You Added New Post Successfully!", "success");
      fetchPosts();
    })
    .catch((error) => {
      let message = error.response.data.message;
      showAlert(message, "danger");
    });
}

//
function postClicked(postId){
    window.location = `postDetails.html?postId=${postId}`
}