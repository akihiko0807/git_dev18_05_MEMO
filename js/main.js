
var savedId = [];
var loadSavedData = JSON.parse(localStorage.getItem('savedId'))
console.log(loadSavedData);
if(loadSavedData){
  savedId = loadSavedData;
}


//Save クリックイベント
$("#save").on("click", function () {

  // val()で値を取得する
  const name = $("#name").val();
  const talk = $("#talk").val();
  // html側で入力されたデータを取得して確認
  console.log(name)
  console.log(talk)
  
  // データを保存する
  if(name){
    localStorage.setItem("name" + clickedId, name);
    savedId.unshift(clickedId);
    localStorage.setItem("savedId", JSON.stringify(savedId));
  }
  if(talk){
    localStorage.setItem("talk" + clickedId, talk);
    savedId.unshift(clickedId);
    localStorage.setItem("savedId", JSON.stringify(savedId));
  }
  console.log(savedId);
  location.reload();
});

$("#clear").on('click', function () {
  // 保存されたデータ（localStorage）を消す
  localStorage.removeItem('image' + clickedId);
  localStorage.removeItem('name' + clickedId);
  localStorage.removeItem('talk' + clickedId);
  location.reload();
});

//2.reset クリックイベント
$("#reset").on('click', function () {
  // 保存されたデータ（localStorage）を消す
  localStorage.clear();
  // 削除するときに、入力されている中身を空にする
  location.reload();
});


const VIDEO = document.querySelector("#camera");    // <video>の要素を取得
const CANVAS = document.querySelector("canvas");
const SHUTTER = document.querySelector("#btn-shutter")
const SE = document.querySelector("#se")
const ctx = CANVAS.getContext("2d");
var clickedId;

// 学籍番号が並んでいるdivをつくる
var str = "";
for( let i = 1; i <= 51; i++ ){
  str += `<div class="member-id num-${i}">` + i + "</div>";
}
$(".member-id-wrapper").html(str);


$(function(){
  if(loadSavedData){
  loadSavedData.forEach(function (value) {
    console.log(value);
    var orderValue = 'nth-child(' + value +')';
    console.log(orderValue);
    $("section div:" + orderValue).css({background: 'aqua'});
  });
}
});


// クリックされたメンバーIDが何番なのかを取得する
// ついでにメンバーIDがクリックされたらビデオの同期が始まる様にする
// ついでにメンバーIDがクリックされたら保存されているimageがcanvasにアウトプットされる様にする
// ついでにメンバーIDがクリックされたら下半分の内容が表示されるようにする
// ついでにメンバーIDがクリックされたら保存されている呼び名と話した内容が表示されるようにする
// ついでにメンバーIDがクリックされたらクリックされているIDの色だけ変わる様にしておく
const lists = Array.from(document.querySelectorAll(".member-id"));
clickedId = lists.forEach(div => {
    div.addEventListener("click", e => {
    clickedId = lists.findIndex(list => list === e.target) + 1;
    console.log(clickedId);
    $(".under-display").removeClass('hidden')
    $(".save-and-clear").removeClass('hidden')
    syncCamera();
    $(".member-id").css({color: '#fff'});
    $(".member-id").css({fontWeight: 'normal'});
    $(".member-id").css({fontFamily: 'sans-serif'});
    var order = 'nth-child(' + clickedId +')';
    $("section div:" + order).css({color: 'black'});
    // $("section div:" + order).css({background: 'aqua'});
    $("section div:" + order).css({fontWeight: 'bold'});
    $("section div:" + order).css({fontFamily: 'Bungee Shade'});
    
    if(localStorage.getItem("image" + clickedId)){
      $("#target").css({opacity: 1});
    var imgdata = localStorage.getItem("image" + clickedId);
    var img = new Image();
    img.onload = function(){
    ctx.drawImage(img,0,0);
    }
    img.src = imgdata;
  } if(!localStorage.getItem("image" + clickedId)) {
    console.log("noimage")
    // var img = new Image();
    // img.onload = function(){
    //   ctx.clearRect(0, 0);
    // }
    $("#target").css({opacity: 0});
  }
    if(localStorage.getItem("name" + clickedId)){
      var namedata = localStorage.getItem("name" + clickedId)
      $("#name").val(namedata);
    }
    if(!localStorage.getItem("name" + clickedId)){
      $("#name").val("");
    }
    if(localStorage.getItem("talk" + clickedId)){
      var namedata = localStorage.getItem("talk" + clickedId)
      $("#talk").val(namedata);
    }
    if(!localStorage.getItem("talk" + clickedId)){
      $("#talk").val("");
    }
    return clickedId;
  });
});

if(clickedId){
  var selectedItem = document.querySelector(`.member-id-wrapper div:nth-child()`);
}

/** カメラ設定 */
const CONSTRAINTS = {    // constraintsの意味は「制約」
  audio: false,
  video: {
    width: 200,
    height: 200,
    facingMode: "user"   // フロントカメラを利用する
    // facingMode: { exact: "environment" }  // リアカメラを利用する場合
  }
};

/**
* [onload] カメラを<video>と同期
*/
function syncCamera(){
  navigator.mediaDevices.getUserMedia(CONSTRAINTS)
  .then( (stream) => {
    VIDEO.srcObject = stream;
    VIDEO.onloadedmetadata = (e) => {
    VIDEO.play();
    };
  })
  .catch( (err) => {
    console.log(`${err.name}: ${err.message}`);
  });
}

// シャッターを押した時の動作が以下

$(function(){
  $("#btn-shutter").on('click', function(){
  // SE再生＆映像停止
  SE.play();
  ctx.drawImage(VIDEO, 0, 0, CANVAS.width, CANVAS.height);
  var canvasData = CANVAS.toDataURL();
  localStorage.setItem("image"+[clickedId],canvasData);
  });
});

