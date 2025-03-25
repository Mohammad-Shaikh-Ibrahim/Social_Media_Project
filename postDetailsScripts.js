// Load posts when the page starts
document.addEventListener("DOMContentLoaded", () => {
  setupUi();
  getPost();
});

//
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");

function getPost() {
  axios.get(`${baseURL}/posts/${id}`).then((response) => {
    let post = response.data.data;
    let comments = post.comments;
    let author = post.author;
    let postTitle = post.title ? post.title : "";

    // If tags is an array, format them as badges
    let tagsContent = "";
    if (Array.isArray(post.tags)) {
      tagsContent = post.tags
        .map(
          (tag) => `<span class="badge bg-secondary me-1">${tag.name}</span>`
        )
        .join("");
    }

    // Update the username span
    document.getElementById("username-span").innerHTML = author.username;

    // Build the comments HTML without extra closing tags
    let commentsContent = "";
    for (let comment of comments) {
      commentsContent += `
            <div class="comment">
                <div class="comment-img">
                    <img
                    src="${comment.author.profile_image}"
                    alt="user"
                    class="rounded-circle border border-3"
                    />
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                    <span class="comment-username">${comment.author.username}</span>
                    </div>
                    
                    <div class="comment-body">
                    ${comment.body}
                    </div>
              </div>
            </div>
        `;
    }

    // Create the complete post content
    const postContent = `
        <div class="card shadow my-4 post">
          <div class="card-header">
            <img
              src="${author.profile_image}"
              alt="user"
              width="40"
              height="40"
              class="rounded-circle border border-3"
            />
            <b>${author.username}</b>
          </div>
          <div class="card-body">
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
          <div id="comments">
            ${commentsContent}
          </div>

            <!-- Input Comment -->
            <div class="input-group my-3 " id="add-comment-div">
                <input id="comment-input" type="text" placeholder="add your comment here." class="form-control"/>
                <button class="btn btn-primary" onclick="createCommentClicked()">Send</button>
            </div>
        </div>
      `;

    // Insert the post content into a dedicated container (e.g., "posts")
    document.getElementById("posts").innerHTML = postContent;
  });
}

// Create Comment
function createCommentClicked() {
  let commentBody = document.getElementById("comment-input").value;
  let params = {
    body: commentBody,
  };
  let token = localStorage.getItem("Token");
  let url = `${baseURL}/posts/${id}/comments`;
  let headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .post(url, params, { headers })
    .then((response) => {
      getPost();
      showAlert("You Added New Comment Successfully!", "success");
    })
    .catch((error) => {
      let message = error.response.data.message;
      showAlert(message, "danger");
    });
}
