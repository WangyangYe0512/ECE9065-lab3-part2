import { Play, Act, Scene } from './play-module.js';

document.addEventListener("DOMContentLoaded", function() {

	
	const url = 'https://www.randyconnolly.com//funwebdev/3rd/api/shakespeare/play.php';

   /*
     To get a specific play, add play name via query string, 
	   e.g., url = url + '?name=hamlet';
	 
	 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
	 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
     
   */
   // get references to <select> elements
   const actList = document.getElementById("actList");
   const sceneList = document.getElementById("sceneList");
   const playHere = document.getElementById("playHere");
   const actHere = document.getElementById("actHere");
   const sceneHere = document.getElementById("sceneHere");
   const btnHighlight = document.getElementById("btnHighlight");
   const playerList = document.getElementById("playerList");
   // Hide everything except the playList <select> element
   document.querySelector("#interface").style.display = "none";
   document.querySelector("#playHere").style.display = "none";

   // define play object
   let play;

   // define function to fetch play data   
   function fetchPlayData(playName) {
      let playURL = url + '?name=' + playName;
      fetch(playURL)
         .then(response => response.json())
         .then(data => {
            // Clear previous speeches
            while (sceneHere.lastElementChild && sceneHere.lastElementChild.className === "speech") {
               sceneHere.removeChild(sceneHere.lastElementChild);
            }
            // Populate other <select> elements and display play content
            
            const acts = data.acts.map(actData => {
               const scenes = actData.scenes.map(sceneData => {
                     return new Scene(sceneData.name, sceneData.title, sceneData.stageDirection, sceneData.speeches);
               });
               return new Act(actData.name, scenes);
            });
            play = new Play(data.title, data.short, data.persona, acts);
            console.log(play);

            // Populate Act <select>
            actList.innerHTML = "";
            play.acts.forEach((act, index) => {
               const option = document.createElement("option");
               option.value = index;
               option.textContent = act.name;
               actList.appendChild(option);
            });

            // Populate Scene <select> with the first Act's Scenes
            sceneList.innerHTML = "";
            play.acts[0].scenes.forEach((scene, index) => {
               const option = document.createElement("option");
               option.value = index;
               option.textContent = scene.name;
               sceneList.appendChild(option);
            });

            // Populate the playerList dropdown when the play data is fetched
            const playerList = document.getElementById("playerList");
            play.persona.forEach(player => {
               const option = document.createElement("option");
               option.value = player.player;
               option.textContent = player.player;
               playerList.appendChild(option);
            });

            // Populate <section id="playHere">, <article id="actHere">, and <div id="sceneHere"> elements
            playHere.querySelector("h2").textContent = play.title;
            actHere.querySelector("h3").textContent = play.acts[0].name;
            const firstScene = play.acts[0].scenes[0];
            sceneHere.querySelector("h4").textContent = firstScene.name;
            sceneHere.querySelector(".title").textContent = firstScene.title;
            sceneHere.querySelector(".direction").textContent = firstScene.stageDirection;
            firstScene.speeches.forEach(speech => {
               const div = document.createElement("div");
               div.className = "speech";
               const span = document.createElement("span");
               span.textContent = speech.speaker;
               div.appendChild(span);
               speech.lines.forEach(line => {
                     const p = document.createElement("p");
                     p.textContent = line;
                     div.appendChild(p);
               });
               sceneHere.appendChild(div);
            });
            // display the interface
            document.querySelector("#interface").style.display = "";
            // display the play content
            document.querySelector("#playHere").style.display = "";
         })
         .catch(error => {
            console.error('Error fetching play data:', error);
         });
   }
   // add event listener to playList <select> element
   document.getElementById('playList').addEventListener('change', function() {
      let playName = this.value;
      if (playName !== '0') {
         fetchPlayData(playName);
      }
   });
   
   // Event handler for actList
   actList.addEventListener("change", function() {
      const selectedActIndex = actList.selectedIndex;
      const selectedAct = play.acts[selectedActIndex];

      // Populate Scene <select> with the selected Act's Scenes
      sceneList.innerHTML = "";
      selectedAct.scenes.forEach((scene, index) => {
         const option = document.createElement("option");
         option.value = index;
         option.textContent = scene.name;
         sceneList.appendChild(option);
      });

      // Display the first scene of the selected act
      const firstSceneOfSelectedAct = selectedAct.scenes[0];
      actHere.getElementsByTagName("h3")[0].textContent = selectedAct.name;
      sceneHere.getElementsByTagName("h4")[0].textContent = firstSceneOfSelectedAct.name;
      sceneHere.getElementsByClassName("title")[0].textContent = firstSceneOfSelectedAct.title;
      sceneHere.getElementsByClassName("direction")[0].textContent = firstSceneOfSelectedAct.stageDirection;

      // Display all players in the playerList dropdown
      playerList.selectedIndex = 0;

      // Clear previous speeches
      while (sceneHere.lastElementChild && sceneHere.lastElementChild.className === "speech") {
         sceneHere.removeChild(sceneHere.lastElementChild);
      }

      firstSceneOfSelectedAct.speeches.forEach(speech => {
         const div = document.createElement("div");
         div.className = "speech";
         const span = document.createElement("span");
         span.textContent = speech.speaker;
         div.appendChild(span);
         speech.lines.forEach(line => {
            const p = document.createElement("p");
            p.textContent = line;
            div.appendChild(p);
         });
         sceneHere.appendChild(div);
      });
   });

   // Event handler for sceneList
   sceneList.addEventListener("change", function() {
      const selectedActIndex = actList.selectedIndex;
      const selectedAct = play.acts[selectedActIndex];
      const selectedSceneIndex = sceneList.selectedIndex;
      const selectedScene = selectedAct.scenes[selectedSceneIndex];

      // Display the selected scene
      sceneHere.getElementsByTagName("h4")[0].textContent = selectedScene.name;
      sceneHere.getElementsByClassName("title")[0].textContent = selectedScene.title;
      sceneHere.getElementsByClassName("direction")[0].textContent = selectedScene.stageDirection;

      // Display all players in the playerList dropdown
      playerList.selectedIndex = 0;

      // Clear previous speeches
      while (sceneHere.lastElementChild && sceneHere.lastElementChild.className === "speech") {
         sceneHere.removeChild(sceneHere.lastElementChild);
      }

      selectedScene.speeches.forEach(speech => {
         const div = document.createElement("div");
         div.className = "speech";
         const span = document.createElement("span");
         span.textContent = speech.speaker;
         div.appendChild(span);
         speech.lines.forEach(line => {
            const p = document.createElement("p");
            p.textContent = line;
            div.appendChild(p);
         });
         sceneHere.appendChild(div);
      });
   });

   // Event handler for btnHighlight
   btnHighlight.addEventListener("click", function() {
    // Get the user-entered text and selected player
      const searchText = document.getElementById("txtHighlight").value.toLowerCase();
      const selectedPlayer = document.getElementById("playerList").value;

      // Clear previous highlights by replacing <b> tags
      document.querySelectorAll("#sceneHere p").forEach(p => {
         p.innerHTML = p.innerHTML.replace(/<b>(.*?)<\/b>/g, '$1');
      });

      // Highlight the user-entered text using <b> tags
      if (searchText) {
         document.querySelectorAll("#sceneHere p").forEach(p => {
               if (p.textContent.toLowerCase().includes(searchText)) {
                  p.innerHTML = p.textContent.replace(new RegExp(searchText, 'gi'), match => `<b>${match}</b>`);
               }
         });
      }

      // Filter speeches by the selected player
      document.querySelectorAll("#sceneHere .speech").forEach(speechDiv => {
         const speaker = speechDiv.querySelector("span").textContent;
         if (selectedPlayer !== "0" && speaker !== selectedPlayer) {
               speechDiv.style.display = "none";
         } else {
               speechDiv.style.display = "";
         }
      });
   });
    /* note: you may get a CORS error if you test this locally (i.e., directly from a
       local file). To work correctly, this needs to be tested on a local web server.  
       Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
       use built-in Live Preview.
    */
});