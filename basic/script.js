$(function () {
  refresh();
  $(window).on('hashchange', function () {
    //syncState(query());
    refresh();
  });
  $('#game-input').on('input', function () {
    $('#position').val('');
    query({game: $(this).val()});
    refresh();
  });
  $('#position').on('input', function () {
    query({game: $('#game-input').val(), board: $(this).val()});
    refresh();
  });
});

//function syncState(state) {
  //var qry = query(state);
  //if (qry.game) {
    //$('#game-input').val(qry.game);
  //}
  //if (qry.board) {
    //$('#position').val(qry.board);
  //}
  //var game = $('#game-input').val();
  //var board = $('#position').val();
  //var state = {game: game, board: board};
  //query(state);
  //return state;
//}

//function inputChange() {
  //syncState();
//}

function populateMoves() {
  var qry = query();
  getNextMoveValues(qry.game, qry.board, function (res) {
    var choices = $('#position-choices');
    choices.html('');
    for (var r in res) {
      var data = res[r];
      var d = $('<button>')
        .addClass('move-select')
        .html(data.board)
        .on('click', function () {
        query({game: qry.game, board: $(this).html()});
      });
      choices.append(d);
    }
  });
}

function refresh() {
  var qry = query();
  if (qry.game && !qry.board) {
    getStart(qry.game, function (start) {
      if (start !== undefined) {
        console.log('got start state')
        query({game: qry.game, board: start});
        populateMoves();
      }
    });
  } else {
    drawBoard(Snap('#main-svg'), qry.board);
    populateMoves();
  }
}

var HOST = 'http://nyc.cs.berkeley.edu:8081/';

function request(game, method, callback) {
  $.get(HOST + game + '/' + method, callback);
}

function getNextMoveValues(game, board, callback) {
  request(game, 'getNextMoveValues?board=' + board, function (res) {
    var res = JSON.parse(res);
    callback(res.response);
  });
}

function getStart(game, callback) {
  request(game, 'getStart', function (res) {
    var res = JSON.parse(res);
    callback(res.response);
  });
}

function parseQuery(val) {
  var i = val.indexOf('?');
  var state = val.slice(i);
  var pairs = val.split('&');
  var out = {};
  for (var pair in pairs) {
    var key = pair.slice(0, pair.indexOf('='));
    var value = pair.slice(pair.indexOf('='));
    out[key] = value.replace(/_/g, ' ')
  }
  return out;
}

function formatQuery(state) {
  var out = '';
  for (var k in state) {
    var v = state[k];
    if (typeof v === 'string') {
      v = v.replace(/ /g, '_');
    }
    out += '&' + k + '=' + v;
  }
  if (out !== '') {
    out = '?' + out.slice(1);
  }
  return out;
}

function query(state) {
  if (state !== undefined) {
    var res = formatQuery(state);
    if ('#' + res !== '' + location.hash) {
      location.hash = res;
    }
    return state;
  } else {
    return parseQuery(location.hash);
  }
}

function drawBoard (svg, boardString) {
  console.log('drawing', boardString);
}
