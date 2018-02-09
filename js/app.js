// Variables para cada clasificación
var urlTopRated = "https://api.themoviedb.org/3/movie/top_rated?page=1&language=es&api_key=e3e74cdb1ed664ea151cee9788f8d797";
var containerRates = "#top_rated";
var urlPopularity = "https://api.themoviedb.org/3/movie/popular?page=1&language=es&api_key=e3e74cdb1ed664ea151cee9788f8d797";
var containerPopular = "#pupular_movies";
var urlUpcoming = "https://api.themoviedb.org/3/movie/upcoming?page=3&language=es&api_key=e3e74cdb1ed664ea151cee9788f8d797";
var containerUpcoming = "#upcoming_movies";
var urlNowPlaying = "https://api.themoviedb.org/3/movie/now_playing?page=1&language=es&api_key=e3e74cdb1ed664ea151cee9788f8d797";
var containerNowPlaying = "#now_playing_movies";


//Eventos para cada tab
$('#upcoming_movies').click(getData(urlUpcoming, containerUpcoming));
$('#pupular_movies').click(getData(urlPopularity, containerPopular));
$('#now_playing_movies').click(getData(urlNowPlaying, containerNowPlaying));
$('#top_rated').click(getData(urlTopRated, containerRates));
// $('#cinemas').click(initialize());


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
      '  <div id="peli"  data-movieid="' + value.id + '"class="card">' +
      '    <div class="card-image waves-effect waves-block waves-light">' +
      '      <img class="activator responsive-img" src="' + 'https://image.tmdb.org/t/p/w500' + value.poster_path + '">' +
      '    </div>' +
      '    <div class="card-content">' +
      '      <span class="card-title activator grey-text text-darken-4">' + value.title + '</span>' +
      '      <p><a href="#">VER TRAILER</a></p>' +
      '    </div>' +
      '    <div class="card-reveal">' +
      '    <span class="card-title grey-text text-darken-4">' + value.title + '<i class="material-icons right">close</i></span>' +
      '      <p>' + value.overview + '</p>' +
      '    </div>' +
      '  </div>' +
      '</div>');
    topRated.append(element);
  });
}

getData(urlNowPlaying, containerNowPlaying);


function checkSubmit(e) {
  if (e && e.keyCode == 13) {
    $('#now_playing_movies').hide();
    $('#pupular_movies').hide();
    $('#upcoming_movies').hide();
    $('#top_rated').hide();
    $('#cinemas').hide();

    $('.main').empty();
    var searching = document.getElementById('search').value;
    search(searching);
    document.getElementById('search').value = "";
    return false;
  }
}
function search(search) {
  //
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
      } else if (overview == "null") {
        //dont show if the overview is null
      } else {
        $(".main").append("<div class='card height-card col m4'" + i +
          "' id='" + id + "'><div class='card-image'><img onclick='movieInfo(" + id + ")' src=" + poster +
          "><div class=''><p class='lead rating'>" + rating +
          " <i class='fa fa-star' aria-hidden='true'></i></p></div></div></div>");
      }
    }
  });
}

//mapa
var defaultLoc = new google.maps.LatLng(19.4203024, -99.1631142);

function drawtMap(latLng) {
    var option = { zoom: 15, center: latLng };

    map = new google.maps.Map(document.getElementById('map'), option);
    //marker
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'tu estas aqui'
    });
    var request = {
        location: latLng,
        radius: '500',
        query: 'Cines'
    };
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                createMarker(results[i]);
            }
        }
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    }
}

//obtener la geolocalización
function initMap() {

    if (navigator.geolocation) {
        //Cargando
        navigator.geolocation.getCurrentPosition(successs, fail);
    } else {
        drawtMap(defaultLoc);
    }
}

//te encontre
function successs(position) {
    drawtMap(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    google.maps.event.trigger(map, 'resize');
}
// no te encontre
function fail(error) {
    drawtMap(defaultLoc);
}

//llamando la funcion
$('#cinemasTab').click(function(e) {
    initMap();
});



// Mostrar trailer

// $('#trailer').click(getTrailer());
//
// function getTrailer() {
//   var id = ('#peli').dataset[movieid];
//   var urlMovie = "https://www.youtube.com/embed/" + id + "/videos?api_key=e3e74cdb1ed664ea151cee9788f8d797&language=es";
//   console.log(urlMovie);
// }
