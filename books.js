const rows = document.querySelectorAll('.row');
const [row1, row2, row3] = rows;
const links = document.querySelectorAll("a.nav-link");
const [link1, link2] = links;
const input = document.querySelector('input');
const read = document.querySelectorAll('.btn-primary')
// const library = document.querySelectorAll('.btn-outline')


class Books {
    constructor(name) {
        this.name = name;
        this.API_URL = `https://www.googleapis.com/books/v1/volumes?q=${this.name}&callback=handleResponse`
    }

    getBooks() {
        fetch(this.API_URL)
            .then((response1) => {
                return response1.text();
            })
            .then((response2) => {
                return response2.slice(91,);
            })

            .then(response3 => {
                return response3.substr(0, response3.length - 4);
            })
            .then(response4 => {
                
                let items = JSON.parse(response4);
                // console.log(items[8].volumeInfo.imageLinks.thumbnail)
               console.log(items);
                
                for (let i in items) {
                    let prefix = items[i].volumeInfo;
                    if (prefix.authors && prefix.categories) {
                        row2.innerHTML += ` 
                        <div class="card">
                            <div class="card-hover">
                                <img src="${prefix.imageLinks.thumbnail}" class="card-img-top">
                                <p class="zoom">${prefix.description}</p>
                            </div>
                            <div class="card-body">
                                <h6 class="card-title">${prefix.title}</h6>
                                <h7 class="font-italic">Authors: ${prefix.authors} </h7>
                                <p class="card-category mt-2">Category: ${prefix.categories}</p>
                                <p class="language"><small>language: ${(prefix.language).toUpperCase()}</small></p>
                                <a href="${prefix.previewLink}" target="_blank" class="btn btn-primary">Read</a>
                                <br>
                                <button type="button" class="btn btn-outline-success btn-sm d-inline mt-3">Add to library</button>
                            </div>
                        </div>
                      `
                    }
                }
            })

            .then(() => {
                document.querySelectorAll('.btn-outline-success').forEach(button => {
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        let currentBook = {
                            title: event.target.parentElement.children[0].innerText,
                            authors: event.target.parentElement.children[1].innerText,
                            categories: event.target.parentElement.children[2].innerText,
                            language: event.target.parentElement.children[3].innerText,
                            link: event.target.parentElement.children[4].href,
                            img: event.target.parentElement.parentElement.children[0].children[0].src,
                            describtion: event.target.parentElement.parentElement.children[0].children[1].innerText
                        }

                        // console.log(currentBook.categories)


                        // fetch("http://localhost:5005/data", {
                        //     method: 'POST',
                        //     body: JSON.stringify(currentBook),
                        //     headers: {
                        //         'Content-Type': 'application/json'
                        //     }
                        // })

                        //     .then(res => res)
                        //     .then((data) => {
                        //         let result = JSON.parse(data)
                        //         return result;
                        //     })
                        // .then(() => {
                        //     document.querySelector('.filterList').classList.remove('del');
                        //     fetch('books.json')
                        //         .then((res) => res.json())
                        //         .then((data) => {
                        //             document.querySelector('.filterList').innerHTML = output;
                        //             data.forEach((x) => {
                        //                 output += `
                        //     <li class="filterListItem btn btn-sm btn-outline-info" data-filter="${x.categories}"> </li>
                        //     `
                        //             })

                        //         })

                        // })
                        document.querySelector('.filterListItem').style.visibility = "visible";



                    })

                })
                // .then(() => {
                //     const category = document.querySelectorAll('.card-category');
                //     const author = document.querySelectorAll('.font-italic')
                //     const desc = document.querySelectorAll('.zoom')


                //     for (let index in category) {

                //         if (category[index].innerText === "Category: undefined") {
                //             category[index].remove();
                //         }
                //     }
                //     for (let param in author) {

                //         if (author[param].innerText === "Authors: undefined") {
                //             author[param].remove();
                //         }
                //     }

                //     for (let y in desc) {

                //         if (desc[y].innerText === "undefined") {
                //             desc[y].innerText = "No describtion";
                //         }
                //     }


                // })

            })
            .catch((err) => console.log(err));

    }


}


input.addEventListener('keyup', (e) => {
    e.preventDefault();

    if (e.which === 13) {
        const searchInput = input.value;
        // console.log(searchInput)
        let book = new Books(searchInput);
        book.getBooks()

        row2.innerHTML = "";

    }

})



link1.addEventListener('click', (e) => {
    e.preventDefault();
    link1.classList.add('active');
    link2.classList.remove('active');
    row3.style.visibility = "hidden";
    row2.style.visibility = "visible";
})


link2.addEventListener('click', (e) => {
    e.preventDefault();
    link2.classList.add('active');
    link1.classList.remove('active');
    row3.style.visibility = "visible";
    row2.style.visibility = "hidden";

    showBooks();
})

function showBooks() {

    fetch('books.json')
        .then((res) => res.json())

        .then((data) => {
            for (let x in data.data)
                row3.innerHTML += `
                <div class="card">
                    <div class="card-hover">
                        <img src="${data.data[x].img}" class="card-img-top">
                        <p class="zoom">${data.data[x].describtion}</p>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">${data.data[x].title}</h6>
                        <h7 class="font-italic">Authors: ${data.data[x].authors} </h7>
                        <p class="card-category mt-2">Category: ${data.data[x].categories}</p>
                        <p class="language"><small>language: ${data.data[x].language}</small></p>
                        <a href="${data.data[x].link}" target="_blank" class="btn btn-primary">Read</a>
                        <br>
                        <button type="button" class="btn btn-outline-success btn-sm d-inline mt-3">Delete from library</button>
                    </div>
                </div>
              `
        })
}



document.querySelectorAll('.btn-outline-success').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault()
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch('books.json/data', options)
            .then(response => response.json())
            .then(data => { console.log(data) })
        //     for (let x in data)
        //     row3.innerHTML += `
        //     <div class="card">
        //         <div class="card-hover">
        //             <img src="${data[x].img}" class="card-img-top">
        //             <p class="zoom">${data[x].describtion}</p>
        //         </div>
        //         <div class="card-body">
        //             <h6 class="card-title">${data[x].title}</h6>
        //             <h7 class="font-italic">Authors: ${data[x].authors} </h7>
        //             <p class="card-category mt-2">Category: ${data[x].categories}</p>
        //             <p class="language"><small>language: ${data[x].language}</small></p>
        //             <a href="${data[x].link}" target="_blank" class="btn btn-primary">Read</a>
        //             <br>
        //             <button type="button" class="btn btn-outline-success btn-sm d-inline mt-3">Delete from library</button>
        //         </div>
        //     </div>
        //   `
        // })

    })
})
























//__await________________________________
// class Books {
//     constructor(name) {
//         this.name = name;
//         this.API_URL = `https://www.googleapis.com/books/v1/volumes?q=${this.name}&callback=handleResponse`
//     }

//     async getBooks() {
//         const response = await fetch(this.API_URL);
//         const response1 = await response.text();
//         const response2 = await response1.slice(89);
//         const response3 = await response2.substr(0, response2.length - 4);
//         const data = await JSON.parse(response3);
//         // console.log(data)

//         for (let i = 0; i < data.length; i++) {
//             let x = data[i].volumeInfo;

//             row.innerHTML += `
//             <div class="column col-lg-2 col-md-3 col-sm-3">
//                 <div class="card" style="width: 12.5rem;">
//                     <img src="${x.imageLinks.thumbnail}" class="card-img-top"  alt="...">
//                     <p class="zoom">${x.description}</p>
//                     <div class="card-body">
//                         <h6 class="card-title">${x.title}</h6>
//                         <h7 class="font-italic">Authors: ${x.authors} </h7>
//                         <p class="card-category mt-2">Category: ${x.categories}</p>
//                         <p class="language"><small>language: ${(x.language).toUpperCase()}</small></p>
//                         <a href="#" class="btn btn-primary">Read</a>
//                     </div>
//                 </div>
//             </div>
//             `
//             row.innerHTML = "";
//         }
//         const category = document.querySelectorAll('.card-category');
//         const author = document.querySelectorAll('.font-italic')
//         const desc = document.querySelectorAll('.zoom')
//         // console.log(category)

//         for (let index in category) {
//             // console.log(category[index])
//             if (category[index].innerText === "Category: undefined") {
//                 category[index].remove();
//             }
//         }
//         for (let param in author) {
//             // console.log(author[param])
//             if (author[param].innerText === "Authors: undefined") {
//                 author[param].remove();
//             }
//         }

//         for (let y in desc) {
//             // console.log(desc[y])
//             if (desc[y].innerText === "undefined") {
//                 desc[y].innerText = "No describtion";
//             }
//         }
//     }

// }




// input.addEventListener('keyup', (e) => {
//     e.preventDefault();

//     if (e.which == 13) {
//         const searchInput = input.value;
//         // console.log(searchInput)
//         let book = new Books(searchInput);
//         book.getBooks()
//             .then(data => console.log(data))
//             .catch(err => console.error(err))

//     }

// })

