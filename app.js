const auth = config.API_TOKEN
const gallery = document.querySelector(".gallery")
const searchInput = document.querySelector(".search-input")
const form = document.querySelector(".search-form")
const more = document.querySelector(".more")
const sugDiv = document.querySelector(".suggest__list")
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

searchInput.addEventListener("input", e => {
    searchValue = e.target.value;
})

form.addEventListener("submit", (e) => {
    e.preventDefault()
    currentSearch = searchValue;
    searchPhotos(searchValue)
})


sugDiv.addEventListener("click", (e) => {
    if (e.target.classList[0] === "suggest__item") {
        currentSearch = e.target.innerText
        searchPhotos(e.target.innerText)
    }
})




async function fetchApi(url) {
    const dataFetch = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: auth
        }
    });
    const data = await dataFetch.json();
    return data
}

function generatePhotos(data) {
    data.photos.forEach(photo => {

        const galleryImg = document.createElement("div")
        galleryImg.classList.add("gallery-img")
        galleryImg.innerHTML = `<img src=${photo.src.large}></img>

        <div class="img-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
        </div>
        `
        gallery.append(galleryImg)

    })
}

async function curatedPhotos() {
    const res = await fetchApi(`https://api.pexels.com/v1/curated?per_page=30&page=1`)
    generatePhotos(res)
}


async function searchPhotos(query) {
    clear()
    const res = await fetchApi(`https://api.pexels.com/v1/search?query=${query}&per_page=30&page=1`)
    generatePhotos(res)
}



function clear(e) {
    gallery.innerHTML = ""
    searchInput.value = ""
}


more.addEventListener("click", loadMore)

async function loadMore() {
    page++
    if (currentSearch) {
        fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=30&page=${page}`
    }
    else {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=30&page=${page}`
    }
    const data = await fetchApi(fetchLink)
    generatePhotos(data)
}




curatedPhotos()