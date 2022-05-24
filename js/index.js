const URL = "https://jsonplaceholder.typicode.com/";

const search = document.getElementById("search");
const postListContainer = document.querySelector(".posts-container");
const postList = document.getElementById("posts");

let dataFetch = getPosts();
let search_term = "";

async function getPosts() {
  try {
    const postRes = await fetch(`${URL}posts`);
    if (postRes.status === 200) {
      dataFetch = await postRes.json();
      displayPosts();
    } else {
      throw new Error(postRes.status);
    }
  } catch (error) {
    console.log(error);
    document.querySelector('.search-field').style.display = 'none';
    document.querySelector('.pagination-wrapper').style.display = 'none';
    postListContainer.innerHTML = 'No posts';
  }
}

async function deletePost(id) {
  if (confirm('Delete this post?')) {
    try {
      const deletePostRes = await fetch(`${URL}posts/${id}`, {
        method: 'DELETE',
      })
      if (deletePostRes.status === 200) {
        let post = dataFetch.find(item => item.id === id);
        let index = dataFetch.indexOf(post)
        dataFetch.splice(index, 1);
        displayPosts();
        console.log(`Post ${id} deleted`)
      } else {
        throw new Error(deletePostRes.status);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    return;
  }
}

async function addPost(title, text) {
  try {
    const createPostRes = await fetch(`${URL}posts`, {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        body: text,
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    if (createPostRes.status === 201) {
      const post = await createPostRes.json();
      dataFetch.push(post);
      displayPosts();
      console.log(`Post succesfully created`)
    } else {
      throw new Error(deletePostRes.status);
    }

  } catch (error) {
    console.log(error);
  }
}

async function getComments(id) {
  try {
    const commentsRes = await fetch(`${URL}posts/${id}/comments`)
    if (commentsRes.status === 200) {
      const comments = await commentsRes.json();
      return comments;
    } else {
      throw new Error(commentsRes.status);
    }
  } catch (error) {
    console.log(error);
  }
}

function displayPosts() {

  let data = dataFetch;

  const prevButton = document.getElementById('btn_prev');
  const nextButton = document.getElementById('btn_next');

  prevButton.addEventListener('click', prevPage);
  nextButton.addEventListener('click', nextPage);

  let current_page = 1;
  let records_per_page = 10;

  function prevPage() {
    if (current_page > 1) {
      current_page--;
      changePage(current_page);
    }
  }

  function nextPage() {
    if (current_page < numPages()) {
      current_page++;
      changePage(current_page);
    }
  }

  function numPages() {
    return Math.ceil(data.length / records_per_page);
  }

  function changeButtonStatus() {
    current_page == 1 ? prevButton.classList.add('disable') : prevButton.classList.remove('disable');
    current_page == numPages() ? nextButton.classList.add('disable') : nextButton.classList.remove('disable');
  }

  function setPageNumbers() {
    let pageNumber = document.getElementById('page_number');
    pageNumber.innerHTML = "";

    for (let i = 1; i < numPages() + 1; i++) {
      pageNumber.innerHTML += "<span class='clickPageNumber'>" + i + "</span>";
    }
  }

  function clickPageNumber() {
    document.addEventListener('click', function (e) {
      if (e.target.nodeName == "SPAN" && e.target.classList.contains("clickPageNumber")) {
        current_page = e.target.textContent;
        changePage(current_page);
      }
    });
  }

  function selectPageNumber() {
    let page_number = document.getElementById('page_number').getElementsByClassName('clickPageNumber');
    for (let i = 0; i < page_number.length; i++) {
      if (i == current_page - 1) {
        page_number[i].style.opacity = "1.0";
      } else {
        page_number[i].style.opacity = "0.5";
      }
    }
  }

  function changePage(page) {

    postList.innerHTML = "";

    for (let i = (page - 1) * records_per_page; i < (page * records_per_page) && i < data.length; i++) {
      postList.innerHTML += renderPosts(data[i]);
    }

    changeButtonStatus();
    selectPageNumber();
  }

  function setSerchTerm(event) {
    search_term = event.target.value.toLowerCase();
    searchPost();
  }
  search.addEventListener("input", setSerchTerm);


  function searchPost() {
    postList.innerHTML = "";
    data = dataFetch.filter((item) => {
      return (
        item.title.toLowerCase().includes(search_term) ||
        item.body.toLowerCase().includes(search_term)
      );
    })

    if (data.length === 0) {
      document.querySelector('.pagination-wrapper').style.display = 'none';
      postList.innerHTML = `<li>No result</li>`
    } else {
      document.querySelector('.pagination-wrapper').style.display = 'flex';
      current_page = 1;
      setPageNumbers();
      changePage(1);
    }

  }

  changePage(1);
  setPageNumbers();
  clickPageNumber();
  selectPageNumber();
  searchPost();
}

function renderPosts(post) {
  return `
     <li class="post-container" onclick="showSinglePost(${post.id})" data-id="${post.id}">
      <p class="post-title">
        ${post.title}
      </p>
      <p class="post-body">
        ${post.body}
      </p>
      <button class="delete-btn" onclick="event.stopPropagation(); deletePost(${post.id});">Delete</button>
     </li>
      `;
}

async function showSinglePost(id) {
  const comments = await getComments(id);
  if (comments != undefined) {
    const post = dataFetch.find(item => item.id === id);
    localStorage.setItem('post', JSON.stringify(post));
    localStorage.setItem('comments', JSON.stringify(comments));
    document.location.href = "post.html";
  }else{
    return;
  }

}

async function createPost() {
  const popupBg = document.querySelector('.popup__bg');
  const popup = document.querySelector('.popup');
  const closePopupButton = document.querySelector('.close-popup');
  const submitBtn = document.querySelector('.submit-form_btn');
  const titleField = document.getElementById('title-value');
  const textField = document.getElementById('text-value');

  popupBg.classList.add('active');
  popup.classList.add('active');

  function closePopup() {
    popupBg.classList.remove('active');
    popup.classList.remove('active');
    closePopupButton.removeEventListener('click', closePopup);
    popupBg.removeEventListener('click', closePopup);
    submitBtn.removeEventListener('click', submitPost);
  }

  function submitPost() {
    closePopup();
    addPost(titleField.value, textField.value)
    titleField.value = '';
    textField.value = '';
  }

  closePopupButton.addEventListener('click', closePopup);
  popupBg.addEventListener('click', closePopup);
  submitBtn.addEventListener('click', submitPost);
}