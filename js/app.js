// Initialize Firebase
var config = {
  apiKey: "AIzaSyBrcy4dkg3a5A-qL7mmXZdko9aPevdPpb4",
  authDomain: "fir-firebase-9a53d.firebaseapp.com",
  databaseURL: "https://fir-firebase-9a53d.firebaseio.com",
  projectId: "fir-firebase-9a53d",
  storageBucket: "fir-firebase-9a53d.appspot.com",
  messagingSenderId: "1090321054037"
};
firebase.initializeApp(config);

function showPlace(concepto, descripcion, horario, lugar) {
    var $row = $("<div />").addClass("row");
    var $col = $("<div />").addClass("col s12");
    var $card = $("<div />").addClass("card");
    var $cardImage = $("<div />").addClass("card-image");
    var $cardContent = $("<div />").addClass("card-content");
    var $cardAction = $("<div />").addClass("card-action");
    var $map = $("<iframe />");
    var $cardTitle = $("<span />").addClass("card-title teal darken-4");
    var $cardDescription = $("<p />");
    var $cardScheduleText = $("<p />");
    var $cardSchedule = $("<strong />");
    var $cardLink = $("<a />");

    $map.attr("src", lugar);
    $map.attr("width", "100%").attr("height", "450");
    $map.attr("frameborder", "0").css("border", "0");
    $map.attr("allowfullscreen", "true");

    $cardTitle.text(concepto);
    $cardDescription.text(descripcion);
    $cardScheduleText.text("Horario:");
    $cardSchedule.text(horario);
    $cardLink.text("¿Cómo llego?");

    $cardScheduleText.append($cardSchedule);
    $cardAction.append($cardLink);
    $cardContent.append($cardDescription);
    $cardContent.append($cardScheduleText);
    $cardImage.append($map);
    $cardImage.append($cardTitle);

    $card.append($cardImage);
    $card.append($cardContent);
    $card.append($cardAction);

    $col.append($card);
    $row.append($col);

    $("#lugares").append($row);
}

$(document).ready(function() {
  $("#form").submit(function(e) {
    e.preventDefault();

    var concepto = $("#concepto").val();
    var descripcion = $("#descripcion").val();
    var horario = $("#horario").val();
    var lugar = $("#lugar").val();

    showPlace(concepto, descripcion, horario, lugar);

    var placeId = new Date().getTime();

    firebase
      .database()
      .ref("places/" + placeId)
      .set({
        concepto: concepto,
        descripcion: descripcion,
        horario: horario,
        lugar: lugar
      });
  });

  $("#login").click(function(e) {
    e.preventDefault();

    var provider = new firebase.auth.FacebookAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        $("#location-form").removeClass("hide");
        $("#login").addClass("hide");
        $("#profile-photo").attr("src", user.photoURL);
        $("#username").text(user.displayName);
        $("#username")
          .parents("li")
          .removeClass("hide");
        $("#logout")
          .parent()
          .removeClass("hide");
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log("no funciona :(", error);
      });
  });

  $("#logout").click(function(e) {
    e.preventDefault();

    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        $("#location-form").addClass("hide");
        $("#login").removeClass("hide");
        $("#username")
          .parents("li")
          .addClass("hide");
        $("#logout")
          .parent()
          .addClass("hide");
      })
      .catch(function(error) {
        // An error happened.
      });
  });

  var placesRef = firebase.database().ref("places/");
  placesRef.on("value", function(snapshot) {
    var places = snapshot.val();
    // Object.keys(places).forEach(function(place) {
    //     console.log(places[key].concepto);
    // });
    for (var key in places) {
        var concepto = places[key].concepto;
        var descripcion = places[key].descripcion;
        var horario = places[key].horario;
        var lugar = places[key].lugar;

        showPlace(concepto, descripcion, horario, lugar);
    }
  });
});
