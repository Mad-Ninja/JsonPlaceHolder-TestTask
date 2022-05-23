const URL = "https://jsonplaceholder.typicode.com/";

const search = document.getElementById("search");
const postListContainer = document.querySelector(".posts-container");
const postList = document.getElementById("posts");

let dataFetch = fetchPosts();


async function fetchPosts() {
  try {
    const postRes = await fetch(`${URL}posts`);
    dataFetch = await postRes.json();
    if (postRes.status != 200) {
      document.querySelector('.search-field').style.display = 'none';
      document.querySelector('.pagination-wrapper').style.display = 'none';
      postListContainer.innerHTML = 'No data';
    }
    displayPosts();

  } catch (error) {
    console.log(error);
    document.querySelector('.search-field').style.display = 'none';
    document.querySelector('.pagination-wrapper').style.display = 'none';
    postListContainer.innerHTML = 'No posts';
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
      postList.innerHTML += renderPost(data[i]);
    }

    changeButtonStatus();
    selectPageNumber();
  }

  let search_term = "";
  search.addEventListener("input", (event) => {
    search_term = event.target.value.toLowerCase();
    searchPost();
  });

  function searchPost() {
    postList.innerHTML = "";
    data = dataFetch.filter((item) => {
      return (
        item.title.toLowerCase().includes(search_term) ||
        item.body.toLowerCase().includes(search_term)
      );
    })
    console.log(data)
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

}

function renderPost(post) {
  return `
     <li class="post-container" onclick="showSinglePost(${post.id})" data-id="${post.id}">
      <p class="post-title">
        ${post.title}
      </p>
      <p class="post-body">
        ${post.body}
      </p>
     </li>
      `;
}

function showSinglePost(id) {}

//displayPosts()