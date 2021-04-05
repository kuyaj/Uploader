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

var storage = firebase.storage();

var uploader = document.getElementById("uploader");
//Get file
var fileButton = document.getElementById("fileButton");

var retrieve = document.getElementById("retrieve");


retrieve.addEventListener("click", function(){
  alert("Hello, retrieve buttton works!");
})


fileButton.addEventListener("change", function(e) {
    var file = e.target.files[0];
  // Create storage reference
    var storageRef = storage.ref("zodiac/"+file.name);

    reader = new FileReader();
    reader.onload = function(){
       document.getElementById("photo").src = reader.result;
   }

  reader.readAsDataURL(file);
  
  //Upload file
  var task = storageRef.put(file);

  alert("The photo has been uploaded! "+file.name);

  task.on('state_changed', function(snapshot){
    console.log("Loading...")  
    task.snapshot.ref.getDownloadURL().then(function(url){
        photoURL = url;
         console.log("URL :"+photoURL)

         var fileName = file.name.split(".")[0];

            firebase.database().ref("zodiac/"+fileName).set({
                name: fileName,
                link: photoURL
        });
        alert("Photo uploaded to firebase!");
        console.log(file);
    });
  }),
  function(error){
      alert("Error in saving photo!")
  }

    
})