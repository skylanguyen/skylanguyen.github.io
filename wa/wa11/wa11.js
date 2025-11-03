let favs = [];


function loadFavs(){
    const saved = localStorage.getItem('favorites');
    if(saved){
        favs = JSON.parse(saved);
        showFavs();
    }
}

function saveFavs(){
    localStorage.setItem('favorites', JSON.stringify(favs));
}

async function search() {
    const query = document.getElementById('search').value;
    if (!query) return;

    document.getElementById('error').textContent = 'Loading...';
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=b9a5e69d&s=${query}`);
        const data = await res.json();

        document.getElementById('error').textContent = "";

        if (data.Response === 'True') {
            showMovies(data.Search);
        } else {
            document.getElementById('error').textContent = 'No movies found';
        }
    } catch (e) {
        document.getElementById('error').textContent = 'Error loading movies';
    }
}

function showMovies(movies) {
    let html = '';
    movies.forEach(m => {
        html += `
            <div>
                <h3> ${m.Title} (${m.Year})</h3>
                ${m.Poster !== 'N/A' ? `<img src="${m.Poster}" width="100">` : ''}
                <br>
                <button onclick='add(${JSON.stringify(m)})'>Add to Favorites</button>
            </div> `;
    });
    document.getElementById('results').innerHTML = html;
}

function add(movie) {
    if (!favs.find(f => f.imdbID == movie.imdbID)) {
        favs.push(movie);
        saveFavs();
        showFavs();
        alert(`"${movie.Title}" added to favorites!`);
    }
}

function remove(id){
    favs = favs.filter(f => f.imdbID !==id);
    saveFavs();
    showFavs();
}

function showFavs() {
    document.getElementById('count').textContent = favs.length;

    if (favs.length === 0) {
        document.getElementById('favorites').innerHTML = '<p>No favorites yet</p>';
        return;
    }

    let html = '';
    favs.forEach(m => {
        html += `
            <div>
                <h3> ${m.Title} (${m.Year})</h3>
                ${m.Poster !== 'N/A' ? `<img src="${m.Poster}" width="100">` : ''}
                <br>
                <button onclick="remove('${m.imdbID}')">Remove</button>
            </div> `;
    });
    document.getElementById('favorites').innerHTML = html;
}

function exportFav(){
    if(favs.length === 0) return;
    const blob = new Blob ([JSON.stringify(favs,null,2)], {type: 'applications/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorites.json';
    a.click();
}

document.getElementById('search').addEventListener('keydown', e => {
    if (e.key === 'Enter')
        search();
});

function clearFavs(){
    if(confirm('Delete all favorites?')){
        favs =[];
        saveFavs();
        showFavs();
    }
}

loadFavs();