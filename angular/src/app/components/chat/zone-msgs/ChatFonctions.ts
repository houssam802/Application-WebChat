import * as $ from "jquery";
export function sendFileChunk(file : any, start : any, end : any, id : any, socket : any){
    var blob = file.slice(start, end);
    if( blob.size != 0 ){
      var reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = () => {
        var buffer = reader.result;
        console.log(buffer);
        socket.emit("fileChunks", buffer, end, id);
      }
    } else {
      socket.emit("FileSent", id);
    }
}
  
  
function message(time : any, msg : any, partie : any, nom : any, messages : any){
  var item = document.createElement('li');
  var contenu = document.createElement('div');
  var tag = document.createElement('div');
  tag.innerText = time + nom;
  contenu.textContent = msg;
  item.setAttribute("class", partie);
  contenu.prepend(tag);
  item.append(contenu);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}
  
function fileSend(time : any, fileName : any, partie : any, nom : any, messages : any){
  var item = document.createElement('li');
  var contenu = document.createElement('div');
  var tag = document.createElement('div');
  tag.innerText = time + nom;
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

export function stockerFichier(form : HTMLFormElement){
  let formData = new FormData(form);
  formData.forEach((value, key) => {
    console.log(key);
    console.log(value);
  })
  $.ajax({
    url: "/api/v1/user/stockerFichier",
    type: 'POST',
    dataType: "JSON",
    headers: {
      "Authorization" : "Bearer " + localStorage.getItem('token')
    },
    data: formData,
    processData: false,
    contentType: false,
    success: function(data: any){
      console.log(data)
    },
    error: function(err: any){
      console.log(err);
    }
  })
}