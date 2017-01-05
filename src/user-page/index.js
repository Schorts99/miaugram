var page = require('page');
var template = require('./template');
var title = require('title');
var empty = require('empty-element');
var header = require('../header');

page('/:username', loadUser, header, function (ctx, next) {
  var main = document.getElementById('main-container');
  title(`Miaugram - ${ctx.user.username}`);
  empty(main).appendChild(template(ctx.user));
  $('.modal-trigger').leanModal();
});

page('/:username/:id', loadUser, header, function (ctx, next) {
  var main = document.getElementById('main-container');
  title(`Miaugram - ${ctx.user.username}`);
  empty(main).appendChild(template(ctx.user));
  $(`#modal${ctx.params.id}`).openModal({
    complete: function () {
      page(`/${ctx.params.username}`)
    }
  });
});

async function loadUser (ctx, next) {
  try {
    ctx.user = await fetch(`/api/user/${ctx.params.username}`).then(res => res.json());
    next();
  } catch (err) {
    console.log(err);
  }
}
