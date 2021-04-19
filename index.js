var firebaseConfig = {
  apiKey: "AIzaSyDV6ATuxNt1OWtIPOioBCtuKDRlSySOQxA",
  authDomain: "photo-uploader-249b1.firebaseapp.com",
  databaseURL: "https://photo-uploader-249b1-default-rtdb.firebaseio.com",
  projectId: "photo-uploader-249b1",
  storageBucket: "photo-uploader-249b1.appspot.com",
  messagingSenderId: "940509958316",
  appId: "1:940509958316:web:bfcb6500d54e3edc664f09"
};

firebase.initializeApp(firebaseConfig);

// storage
var storage = firebase.storage();

//firebase
var database = firebase.database();

// var retrieve = document.getElementById("retrieve");
//Get file
var fileButton = document.getElementById("fileButton");

// 1. let users select a photo from his computer
// 2. display the photo to photo displayer
// 3. upload the photo the firebase storage
// 4. get the url link of the photo from the firebase minutes after it's uploaded
// 5. upload the url link together with it's identifier to the firebase database
// 6. fetch those photo url links from firebase storage and display them all thru html

fileButton.addEventListener("change", function (e) {
  var file = e.target.files[0];
  // Create storage reference
  var storageRef = storage.ref("zodiac/" + file.name);

  reader = new FileReader();
  reader.onload = function () {
    document.getElementById("photo").src = reader.result;
  };

  reader.readAsDataURL(file);

  //Upload file to storage
  var task = storageRef.put(file);
  task.on("state_changed", function (snapshot) {
    task.snapshot.ref.getDownloadURL().then(function (url) {
      photoURL = url;
      console.log("URL :" + photoURL);

      var fileName = file.name.split(".")[0];

      firebase
        .database()
        .ref("zodiac/" + fileName)
        .set({
          name: fileName,
          link: photoURL
        });
    });
  }),
    function (error) {
      alert("Error in saving photo!");
    };
});

document.addEventListener("DOMContentLoaded", function () {
  database.ref("zodiac").on("value", (snapShot) => {
    let zodiac = Object.entries(snapShot.val())
      .map((item) => {
        var [keys, values] = item;
        var { name, link } = values;
        return {
          name: name,
          link: link
        };
      })
      .reverse();

    var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = { zodiac: zodiac };
    var html = template(context);

    document.getElementById("zodiacs").innerHTML = html;

    var btns = document.querySelectorAll(".delete");

    Array.prototype.forEach.call(btns, function addClickListener(btn) {
      btn.addEventListener("click", function (event) {
        var fileUrl = this.dataset.url;
        var dataRef = this.dataset.ref;
        // Create a reference to the file to delete
        var fileRef = storage.refFromURL(fileUrl);

        fileRef
          .delete()
          .then(function () {
            database.ref("/zodiac/" + dataRef).remove();
            alert("File deleted!");
          })
          .catch(function (error) {
            alert(error);
          });
      });
    });
  });
});

// / deleting file from firebase storage

// var fileUrl =
// 'https://firebasestorage.googleapis.com/b/bucket/o/images%20geeksforgeeks.jpg';

// // Create a reference to the file to delete
// var fileRef = storage.refFromURL(fileUrl);

// console.log("File in database before delete exists : "
//         + fileRef.exists())

// // Delete the file using the delete() method
// fileRef.delete().then(function () {

//     // File deleted successfully
//     console.log("File Deleted")
// }).catch(function (error) {
//     // Some Error occurred
// });

///testing

document.getElementById("test").addEventListener("click", function () {
  var test_url =
    "https://firebasestorage.googleapis.com/v0/b/photo-uploader-249b1.appspot.com/o/zodiac%2Faquarius.jpg?alt=media&token=9cea8ab0-f99a-441e-958d-da7104cca095";

  var fileRef = storage.refFromURL(test_url);
  alert(fileRef);
  fileRef
    .delete()
    .then(function () {
      database.ref("/zodiac/aquarius").remove();
      alert("File deleted!");
    })
    .catch(function (error) {
      alert(error);
    });
});
