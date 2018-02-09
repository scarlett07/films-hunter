
// Variables para cada clasificación
var urlTopRated = "https://api.themoviedb.org/3/movie/top_rated?page=1&language=es&api_key=e3e74cdb1ed664ea151cee9788f8d797";
var containerRates = "#top_rated";
var urlPopularity = "https://api.themoviedb.org/3/movie/popular?page=1&language=es&api_key=e3e74cdb1ed664ea151cee9788f8d797";
var containerPopular = "#pupular_movies";
var urlUpcoming = "https://api.themoviedb.org/3/movie/upcoming?page=3&language=es&api_key=e3e74cdb1ed664ea151cee9788f8d797";
var containerUpcoming= "#upcoming_movies";
var urlNowPlaying = "https://api.themoviedb.org/3/movie/now_playing?page=1&language=es&api_key=e3e74cdb1ed664ea151cee9788f8d797";
var containerNowPlaying = "#now_playing_movies";


//Eventos para cada tab
$('#upcoming_movies').click(getData(urlUpcoming, containerUpcoming));
$('#pupular_movies').click (getData(urlPopularity, containerPopular));
$('#pupular_movies').click (getData(urlNowPlaying, containerNowPlaying));
$('#top_rated').click (getData(urlTopRated, containerRates));
$(".button-collapse").sideNav();

//Conectando con la API
function getData(url, container) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": url,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }
  $.ajax(settings).done(function(response) {
    console.log(response);
    //Cargando las películas
    loadMovies(response, container);
  });
}
// Función para cargar las películas
function loadMovies(data, container) {
  var topRated = $(container);
  $.each(data.results, function(index, value) {
    var element = $(
      '<div class="col m4 height-card">' +
      '  <div  data-movie_id="'+ value.id +'"class="card">' +
      '    <div class="card-image waves-effect waves-block waves-light">' +
      '      <img class="activator responsive-img" src="'+ 'https://image.tmdb.org/t/p/w500' + value.poster_path +'">' +
      '    </div>'+
      '    <div class="card-content">'+
      '      <span class="card-title activator grey-text text-darken-4">' + value.title + '</span>' +
      '      <p><a href="#">VER TRAILER</a></p>' +
      '    </div>' +
      '    <div class="card-reveal">' +
      '    <span class="card-title grey-text text-darken-4">'+ value.title + '<i class="material-icons right">close</i></span>'+
      '      <p>' + value.overview + '</p>' +
      '    </div>' +
      '  </div>' +
      '</div>');
      topRated.append(element);
  });
}

getData(urlNowPlaying, containerNowPlaying);

function checkSubmit(e) {
 if (e && e.keyCode == 13){
   $('#now_playing_movies').hide();
   $('.main').empty();
   var searching = document.getElementById('search').value;
   search(searching);
   document.getElementById('search').value = "";
   return false;
 }
}

function search(search) {
 $(".movies").remove();
 $(".tv").remove();
 //http://api.themoviedb.org/3/search/multi?api_key=84ade81a32ab2ef4395fd367ad4ea5be&query=
 var searchurl = "https://api.themoviedb.org/3/search/multi?api_key=e3e74cdb1ed664ea151cee9788f8d797&query=";
 var posterPaths = "http://image.tmdb.org/t/p/w500";
 $.getJSON(searchurl + search, function(data) {
   for (var i = 0; i < data.results.length; i++) {
     var id = data.results[i].id;
     var title = data.results[i].name;
     var rating = data.results[i].vote_average;
     var poster = posterPaths + data.results[i].poster_path;
     var overview = data.results[i].overview;
     if (poster === "http://image.tmdb.org/t/p/w500null") {
         //if their is no poster dont show the movie
     }
     else if(overview == "null"){
       //dont show if the overview is null
     }
     else{
     $(".main").append("<div class='card col m4 height-card'" + i +
     "' id='" + id + "'><div class='card-image'><img onclick='movieInfo(" + id + ")' src=" + poster +
      "><div class=''><p class='lead rating center big'>" + rating +
       " <i class='fa fa-star' aria-hidden='true'></i></p></div></div></div>");
     }
   }
 });
}
