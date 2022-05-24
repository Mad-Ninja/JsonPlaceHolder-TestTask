const postContainer = document.querySelector(".post-container");
const post = JSON.parse(localStorage.getItem('post'));
const comments = JSON.parse(localStorage.getItem('comments'));


function displaySinglePost() {

    commentsContainer = document.createElement("ul");
    comments.forEach(
        (comment) =>
        (commentsContainer.innerHTML += `
        <li class="comment-container">         
            <p class="comment-email">${comment.email}</p>
            <p class="comment-name">${comment.name}</p>
            <p class="comment-body">${comment.body}</p>
        </li>
      `)
    );

    postContainer.innerHTML = ` 
        <p class="post-title">
            ${post.title}
        </p>
        <p class="post-body">
            ${post.body}
        </p>
        <hr class="seperator">
        <div class="comments-container">
            <h3 class="comment-header">Comments <sup>(${comments.length})</sup></h3>
            <ul>
                ${commentsContainer.innerHTML}
            </ul>  
        </div>
    `
}


displaySinglePost();