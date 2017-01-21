var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');
var request = require('superagent');
var header = require('../header');
var axios = require('axios');
var Webcam = require('webcamjs');
var picture = require('../picture-card');

page('/', header, loading, asyncLoad, function (ctx, next) {
  title('Miaugram');
  var main = document.getElementById('main-container');

  empty(main).appendChild(template(ctx.pictures));

  const picturePreview = $('#picture-preview');
  const camaraInput = $('#camara-input');
  const cancelPicture = $('#cancelPicture');
  const shootButton = $('#shoot');
  const uploadButton = $('#uploadButton');

  function reset(){
    picturePreview.html(`<img src="${data_uri}"/>`);
    picturePreview.addClass('hide');
    cancelPicture.addClass('hide');
    uploadButton.addClass('hide');
    shootButton.removeClass('hide');
    camaraInput.removeClass('hide');
  }

  cancelPicture.click(reset);

  $('.modal-trigger').leanModal({
    ready: function(){
      Webcam.attach('#camara-input');
      shootButton.click((ev) =>{
        Webcam.snap(function(data_uri){
          picturePreview.html(`<img src="${data_uri}"/>`);
          picturePreview.removeClass('hide');
          cancelPicture.removeClass('hide');
          uploadButton.removeClass('hide');
          shootButton.addClass('hide');
          camaraInput.addClass('hide');
          uploadButton.off('click');
          uploadButton.click(() =>{
            const pic = {
              url: data_uri,
              likes: 11,
              liked: false,
              createdAt: +new Date(),
              user: {
                username: 'MiauMiau',
                avatar: 'https://scontent-dft4-1.cdninstagram.com/t51.2885-19/s150x150/14607014_979200455518856_6501924825026527232_a.jpg'
              }
            }
            $('#picture-cards').prepend(picture(pic));
            reset();
            $('#modalCamara').closeModal();
          })
        })
      })
    },
    complete: function(){
      Webcam.reset();
      reset();
    }
  })
})

function loading(ctx, next) {
  var container = document.createElement('div');
  var loadingEl = document.createElement('div');
  container.classList.add('loader-container');
  loadingEl.classList.add('loader');
  container.appendChild(loadingEl);
  var main = document.getElementById('main-container');
  empty(main).appendChild(container);
  next();
}

async function asyncLoad(ctx, next) {
  try {
    ctx.pictures = await fetch('/api/pictures').then(res => res.json());
    next();
  } catch (err) {
    return console.log(err);
  }
}
