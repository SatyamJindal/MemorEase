// Create the type of element you pass in the parameters
const createNode = (element) => {
    return document.createElement(element); 
}

// Append the second parameter(element) to the first one
const appendElement = (parent, el) => {
    return parent.appendChild(el); 
}

const addPhoto = () => {
    let photoName = document.getElementById("photoName").value;
    let photoDesc = document.getElementById("photoDesc").value;
    let albumName = document.getElementById("albumName").innerHTML;

    postData("/addPhoto", {
        photoName: photoName,
        photoDesc: photoDesc,
        albumName: albumName
    });
    getData(`/photoData/${albumName}`);
}

const getData = async (url= "") => {
    const response = await fetch(url);
    let rows = await response.json();
    let rowDiv = document.getElementById("photoData");

    rows.map((row) => {
        let div1 = createNode('div'),
            div2 = createNode('div'),
            div3 = createNode('div'),
            p1 = createNode('p'),
            p2 = createNode('p'),
            img = createNode('img'),
            div4 = createNode('div'),
            div5 = createNode('div'),
            button1 = createNode('button'),
            button2 = createNode('button'),
            small = createNode('small');
        img.src = '/uploads/' + `${row.file_name}`;
        img.width=355;
        img.height=430;
        div1.classList.add("col-md-4");
        div2.classList.add("card");
        div2.classList.add("mb-4");
        div2.classList.add("shadow-sm");
        div3.classList.add("card-body");
        p1.classList.add("card-text");
        p2.classList.add("card-text");
        div4.classList.add("d-flex");
        div4.classList.add("justify-content-between");
        div4.classList.add("align-items-center");
        div5.classList.add("btn-group");
        button1.classList.add("btn");
        button1.classList.add("btn-outline-secondary");
        button1.classList.add("btn-sm");
        button2.classList.add("btn");
        button2.classList.add("btn-outline-secondary");
        button2.classList.add("btn-sm");
        small.classList.add("text-muted");
        small.innerHTML = `${row.createdAt}`;
        p1.innerHTML = `${row.photo_name}`;
        p2.innerHTML = `${row.photo_desc}`;
        console.log(`${row.file_name}`);
        appendElement(div4, div5);
        appendElement(div4, small);
        appendElement(div3, p1);
        appendElement(div3, p2);
        appendElement(div3, div4);
        appendElement(div2, div3);
        appendElement(div1, div2);
        appendElement(rowDiv, div1);
        appendElement(div1,img);

    });
}

const postData = (url = "", data = {}) => {
      return fetch(url, {
          method: 'POST', 
          mode: 'cors', // no-cors, cors, *same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
              'Content-Type': 'application/json',
          },
        //   redirect: 'follow', // manual, *follow, error
        //   referrer: 'no-referrer', // no-referrer, *client
          body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
      .then(response => response.json()); // parses JSON response into native Javascript objects 
  }

window.addEventListener('load', () => {
    let albumName = document.getElementById("albumName").innerHTML;
    getData(`/photoData/${albumName}`);
});