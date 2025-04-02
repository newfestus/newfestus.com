let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 56.1304, lng: -106.3468 }, // Canada
    zoom: 4,
  });
}

$(document).ready(function () {
  const weatherApiKey = "221987fc1337a5bdfc4851f0a4838189";

  // Theme toggle
  $("#toggleTheme").click(function () {
    $("body").toggleClass("dark");
  });

  // Accordion
  $("#accordion").accordion({
    collapsible: true,
    active: false
  });  

  // Datepicker
  $("#datepicker").datepicker();

  // Form Validation
  $("#bookingForm").validate();

  // Sortable Trip List
  $("#tripList").sortable();

  // Slick Carousel
  $(".carousel").slick({
    autoplay: true,
    dots: true,
    arrows: false,
  });

  // Search destination and fetch weather
  $("#searchBtn").click(function () {
    const location = $("#destination").val();
    if (!location) return alert("Please enter a destination.");

    $("#loading").show();
    $("#weatherResult").html("");

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;

          map.setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
          map.setZoom(10);

          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`;
          return fetch(weatherUrl);
        } else {
          throw new Error("Location not found");
        }
      })
      .then(response => response.json())
      .then(data => {
        $("#loading").hide();
        const city = data.name;
        const temp = data.main.temp;
        const weather = data.weather[0].description;
        $("#weatherResult").html(`<p><strong>${city}</strong><br>Temperature: ${temp}°C<br>Condition: ${weather}</p>`);
      })
      .catch(error => {
        $("#loading").hide();
        alert("Could not fetch weather data.");
        console.error(error);
      });
  });

  // Weather from current location
  $("#getWeather").click(() => {
    $("#loading").show();
    $("#weatherResult").html("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`;

        fetch(weatherUrl)
          .then(response => response.json())
          .then(data => {
            $("#loading").hide();
            const city = data.name;
            const temp = data.main.temp;
            const weather = data.weather[0].description;
            $("#weatherResult").html(`<p><strong>${city}</strong><br>Temperature: ${temp}°C<br>Condition: ${weather}</p>`);
          })
          .catch(error => {
            $("#loading").hide();
            alert("Could not fetch weather data.");
            console.error(error);
          });

      }, () => {
        $("#loading").hide();
        alert("Location access denied.");
      });
    } else {
      $("#loading").hide();
      alert("Geolocation not supported.");
    }
  });

  // Smooth scroll for nav links
  $("#navbar a").on("click", function (e) {
    e.preventDefault();
    const target = $(this).attr("href");
    $("html, body").animate({
      scrollTop: $(target).offset().top - 60
    }, 800);
  });

  // Fade in animation on load
  $("section").hide().fadeIn(1500);
});