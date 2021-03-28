const ul = document.querySelector('ul');
const title = document.querySelector('#title');
const imgContainer = document.querySelector('.imgContainer');
const arrow = document.querySelector('.nav-arrow-down');
const firstPage = document.querySelector('.firstPage');
let textChange = document.querySelector('.textChange');
let beerDetailsBackground = document.querySelector('.beerDetailsBackground');
const cards = document.querySelectorAll('.card');
const fontSizeTable = ['0.4em', '0.6em', '1em', '0.6em', '0.4em'];
const cardDetail = document.querySelector('.beerDetails');
let lastActiveElement = null;
let words = [
        'A place where the beer flows',
        'Created by passionate experts',
        'Amber, brown, blonde, black... The difficult choice'
    ],
    part,
    i = 0,
    offset = 0,
    len = words.length,
    forwards = true,
    skip_count = 0,
    skip_delay = 50,
    speed = 50;
const beerImg = document.querySelector('.beerImg');
const beerVolume = document.querySelector('.beerVolume');
const beerTagline = document.querySelector('.beerTagline');
const beerName = document.querySelector('.beerName');
const beerDescription = document.querySelector('.beerDescription');
const add = document.querySelector('.add');
const beerFormAdd = document.querySelector('#beerFormAdd');
const beerFormUpdate = document.querySelector('#beerFormUpdate');
const deleteE = document.querySelector('.delete');
const edit = document.querySelector('.edit');
const name = document.querySelector('#nameUpdate');
const tagline = document.querySelector('#taglineUpdate');
const abv = document.querySelector('#abvUpdate');
const ebc = document.querySelector('#ebcUpdate');
const description = document.querySelector('#descriptionUpdate');
const first_brewed = document.querySelector('#first_brewedUpdate');
const volume = document.querySelector('#volumeUpdate');
const idUpdate = document.querySelector('#idUpdate');
let idBeer = 1;

document.addEventListener("DOMContentLoaded", function() {
    /** Gestion du changement automatique des phrases (page d'accueil) */
    wordflick();

    /** Quand on clique sur la flèche, la page d'accueil monte */
    arrow.addEventListener("click", function() {
        firstPage.classList.add('hidden');
        for (let i = 0; i < imgContainer.children.length; i++) {
            if (imgContainer.children[i].offsetTop + imgContainer.children[i].offsetHeight !== 0) {
                imgContainer.children[i].offsetTop += 1;
            }
        }
        setFontSizeFromList(ul);
        for (let i = 0; i < ul.children.length; i++) {
            ul.children[i].addEventListener("click", function() {
                menuClick(this);
            });
        }
    });

    /**
     * Pour chaque card, on leur assigne un clique event qui permet
     * d'afficher une page avec de plus amples détails
     */
    for(let card of cards) {
        card.addEventListener("click", function() {
            fetch('beers/' + this.id)
            .then(function(response) {
                return response.json();
            }).then(function(objet) {
                beerImg.style.backgroundImage = 'url(' + objet[0].image_url + ')';
                beerName.innerHTML = objet[0].name;
                beerVolume.innerHTML = objet[0].volume.value + " L";
                beerTagline.innerHTML = objet[0].tagline;
                beerDescription.innerHTML = objet[0].description;
            })
            cardDetail.classList.add('active');
            cardDetail.id = this.id + "_beerDetail";
            beerDetailsBackground.style.display = 'block';
        });
    }

    /**
     * Si en clique en dehors d'un form ou du détail d'une bière,
     * on en sors et retourne à la page de liste des bières
     */
    beerDetailsBackground.addEventListener("click", function () {
        beerDetailsBackground.style.display = 'none';
        if(cardDetail.classList.contains('active')) {
            cardDetail.classList.remove('active');
        }
        if(beerFormAdd.classList.contains('active')) {
            beerFormAdd.classList.remove('active');
        }
        if(beerFormUpdate.classList.contains('active')) {
            beerFormUpdate.classList.remove('active');
        }
    })

    /** Quand on clique sur la croix pour ajouter une bière */
    add.addEventListener("click", function () {
        beerFormAdd.classList.add('active');
        beerDetailsBackground.style.display = 'block';
    });

    /**
     * Quand on clique sur la poubelle pour delete une bière
     * (dans les détails de la bière)
     */
    deleteE.addEventListener("click", function () {
        fetch('beers/' + cardDetail.id.match('.+?(?=_)')[0],{ method: "POST" })
        .then(function(response) {
            location.reload();
        })
    });

    /**
     * Quand on clique sur le crayon pour éditer une bière
     * (dans les détails de la bière)
     */
    edit.addEventListener("click", function () {
        idBeer = cardDetail.id.match('.+?(?=_)')[0];
        cardDetail.classList.remove('active');
        beerFormUpdate.classList.add('active');
        fetch('beers/' + cardDetail.id.match('.+?(?=_)')[0])
            .then(function(response) {
                return response.json();
            }).then(function(objet) {
            idUpdate.value = objet[0].id;
            console.log(idUpdate.value);
            console.log(objet[0].id);
            name.value = objet[0].name;
            tagline.value = objet[0].tagline;
            abv.value = objet[0].abv;
            ebc.value = objet[0].ebc;
            description.value = objet[0].description;
            first_brewed.value = objet[0].first_brewed;
            volume.value = objet[0].volume.value;
        })
    });
});

function searchActiveElement() {
    for (let i = 0; i < ul.children.length; i++) {
        if(ul.children[i].classList.contains('active')) {
            return i;
        }
    }
}

function searchActiveElementTwo() {
    for (let i = 0; i < imgContainer.children.length; i++) {
        if(imgContainer.children[i].classList.contains('active')) {
            return i;
        }
    }
}

function getIndexOfElementFromList(element, list) {
    for (let i = 0; i < list.length; i++) {
        if(list[i] === element) {
            return i;
        }
    }
}

function setFontSizeFromList(list) {
    for (let i = 0; i < ul.children.length; i++) {
        list.children[i].style.fontSize = fontSizeTable[i];
    }
}

function menuClick(elementClicked) {
    let indexActive = searchActiveElement();
    let gap = getIndexOfElementFromList(elementClicked, ul.children) < indexActive ? indexActive - getIndexOfElementFromList(elementClicked,  ul.children) : getIndexOfElementFromList(elementClicked,  ul.children) - indexActive;

    if(getIndexOfElementFromList(elementClicked, ul.children) !== indexActive) {
        if (lastActiveElement != null) {
            imgContainer.children[lastActiveElement].classList.remove("top");
            imgContainer.children[lastActiveElement].classList.add("bottom");
        }
        lastActiveElement = searchActiveElementTwo();
        imgContainer.children[searchActiveElementTwo()].classList.add('top');
        imgContainer.children[searchActiveElementTwo()].classList.remove('active');
        document.querySelector("#" + elementClicked.innerHTML.toLowerCase()).classList.remove("bottom");
        document.querySelector("#" + elementClicked.innerHTML.toLowerCase()).classList.add("active");

        if(imgContainer.children[searchActiveElementTwo()].id === 'beers') {
            add.style.display = 'block';
        } else {
            add.style.display = 'none';
        }
    }

    for(let i = 0; i < gap; i++) {
        indexActive = searchActiveElement();
        if(getIndexOfElementFromList(elementClicked, ul.children) !== indexActive) {
            ul.children[indexActive].classList.remove('active');
            if(getIndexOfElementFromList(elementClicked, ul.children) < indexActive) {
                // If the user clicks above the active element (the menu will go down)
                ul.children[indexActive].previousElementSibling.classList.add('active');
                ul.lastElementChild.remove();
                ul.lastElementChild.classList.add('noHeight');
                ul.firstElementChild.classList.remove('noHeight');

                let newElement = document.createElement('li');
                newElement.classList.add('noHeight');
                newElement.innerHTML =  ul.lastElementChild.previousElementSibling.innerHTML;
                ul.firstElementChild.before(newElement);

                ul.firstElementChild.addEventListener("click", function() {
                    menuClick(this);
                });

                setFontSizeFromList(ul);
            } else if(getIndexOfElementFromList(elementClicked, ul.children) > indexActive) {
                // If the user clicks below the active element (the menu will go up)
                ul.children[indexActive].nextElementSibling.classList.add('active');
                ul.firstElementChild.remove();
                ul.firstElementChild.classList.add('noHeight');
                ul.lastElementChild.classList.remove('noHeight');

                let newElement = document.createElement('li');
                newElement.classList.add('noHeight');
                newElement.innerHTML =  ul.firstElementChild.nextElementSibling.innerHTML;
                ul.lastElementChild.after(newElement);

                ul.lastElementChild.addEventListener("click", function() {
                    menuClick(this);
                });
                setFontSizeFromList(ul);
            }
        }
    }
}

function wordflick(){
    setInterval(function(){
        if (forwards) {
            if(offset >= words[i].length){
                ++skip_count;
                if (skip_count === skip_delay) {
                    forwards = false;
                    skip_count = 0;
                }
            }
        }
        else {
            if(offset === 0){
                forwards = true;
                i++;
                offset = 0;
                if(i >= len){
                    i=0;
                }
            }
        }
        part = words[i].substr(0, offset);
        if (skip_count === 0) {
            if (forwards) {
                offset++;
            }
            else {
                offset--;
            }
        }
        textChange.innerHTML = part;
    },speed);
}