export function sendFileChunk(file : any, start : any, end : any, id : any, socket : any){
    var blob = file.slice(start, end);
    if( blob.size != 0 ){
      var reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = () => {
        var buffer = reader.result;
        socket.emit("fileChunks", buffer, end, id);
      }
    } else {
      socket.emit("FileSent", id);
    }
}
  
export function myFunc(user : any, form : any, input : any, messages : any, fileLoader : any, file : any, bufferTotal : any, socket : any){
  var userPlace : any = document.getElementById("user"); 
  userPlace.innerHTML = user.split(",")[1];
  fileLoader.onchange = (event : any) => {
    file = event.target.files[0];
    var fileName = file.name;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      var blob : any = reader.result;
      let dataMime = blob.split(",")[0];
      fileSend(file.name, "emetteur", "Vous", messages);
      let boucle, pas;
      if( file.size > 100000 ){
        boucle = Math.round(file.size/100000);
        pas = Math.round(file.size/boucle);
      } else {
        pas = 100000;
      }
      socket.emit("File", pas, dataMime, fileName, user.split(",")[0]);
    } 
  }
  form.onsubmit = (event : any) => {
    event.preventDefault();
    if( input.value ){
        message(input.value, "emetteur", "Vous", messages);
        socket.emit("private message", input.value, user.split(",")[0]);
        input.value = '';
    }
  }

  socket.on("fileChunks", function(start: any, end: any, id: any) {
      sendFileChunk(file, start, end, id, socket);
  });

  socket.on("FileSent", function(fileName: any, dataMime: any, EmetteurID: any, EmetteurName: any){
    var binary = '';
    var uint8 = new Uint8Array(bufferTotal);
    console.log(bufferTotal);
    for(var i = 0; i<uint8.byteLength; i++ ){ 
      binary += String.fromCharCode( uint8[ i ] );
    }
    var base64 = btoa(binary);
    fileReceived(fileName, dataMime, base64, EmetteurName, messages);
  });

  socket.on("FileReceived", function(buffer: any) {
    console.log(buffer);
    var uint8 = new Uint8Array(buffer.byteLength + bufferTotal.byteLength);
    uint8.set(new Uint8Array(bufferTotal), 0);
    uint8.set(new Uint8Array(buffer), bufferTotal.byteLength);
    bufferTotal = uint8.buffer;
  });


  socket.on("private message", function(EmetteurID: any, EmetteurName: any,msg: any) {
    message(msg, "destinateur", EmetteurName, messages);
  });

  socket.on("sendfile", function(EmetteurID: any, EmetteurName: any, fileName: any, file: any) {
    fileReceived(fileName, file, "destinateur", EmetteurName, messages);
  });

}
  
  
function message(msg : any, partie : any, nom : any, messages : any){
  console.log(messages);
  var item = document.createElement('li');
  var contenu = document.createElement('div');
  var tag = document.createElement('div');
  tag.innerText = nom;
  contenu.textContent = msg;
  item.setAttribute("class", partie);
  contenu.prepend(tag);
  item.append(contenu);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}
  
function fileSend(fileName : any, partie : any, nom : any, messages : any){
  var item = document.createElement('li');
  var contenu = document.createElement('div');
  var tag = document.createElement('div');
  tag.innerText = nom;
  var fileNameTab = fileName.split(".");
  var extension = fileNameTab[fileNameTab.length -1 ];
  var icon = document.createElement("div");
  var iconContent = document.createElement("div");
  icon.classList.add("fi");
  icon.classList.add("fi-" + extension );
  icon.classList.add("fi-size-xs");
  iconContent.classList.add('fi-content');
  iconContent.innerText = extension;
  icon.append(iconContent);
  icon.setAttribute("style","margin-right: .5rem; ");
  contenu.append(icon);
  contenu.append(fileName);
  item.classList.add(partie);
  contenu.prepend(tag);
  item.append(contenu);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}
  
function fileReceived(fileName : any, dataMime : any, base64 : any, nom : any, messages : any) {
  var item = document.createElement('li');
  var contenu = document.createElement('div');
  var tag = document.createElement('div');
  tag.innerText = nom;
  var fileNameTab = fileName.split(".");
  var extension = fileNameTab[fileNameTab.length -1 ];
  var icon = document.createElement("div");
  var iconContent = document.createElement("div");
  icon.classList.add("fi");
  icon.classList.add("fi-" + extension );
  icon.classList.add("fi-size-xs");
  iconContent.classList.add('fi-content');
  iconContent.innerText = extension;
  icon.append(iconContent);
  icon.setAttribute("style","margin-right: .5rem; ");
  contenu.append(icon);
  contenu.append(fileName);
  item.classList.add("destinateur");
  var input = document.createElement("button");
  var span1 = document.createElement("span");
  input.onclick = () => {
    download(fileName, dataMime, base64);
  }
  span1.classList.add("fa");
  span1.classList.add("fa-arrow-down");
  input.append(span1);
  contenu.append(input);
  contenu.prepend(tag);
  item.append(contenu);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

function download(filename : any, dataMime : any, base64 : any) {
  var a = document.createElement("a");
  var context = dataMime + "," + base64;
  a.setAttribute("href", context);
  a.setAttribute("download", filename);
  a.style.display = "none";
  document.body.append(a);
  a.click();
  document.body.removeChild(a);
}