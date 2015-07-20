var gm = require('gm').subClass({
  imageMagick: true
});
var _ = require('lodash');
exports.code = function(req, res) {
  var text = '2345678abcdefhijkmnpqrstuvwxyzABCDEFGHJKLMNPQRTUVWXY';
  var imageW = 80;
  var imageH = 30;
  var length = 4;
  var fontSize = 20;
  var verifyCode = '';
  var textRgb = "RGB(" + _.random(1, 150) + ", " + _.random(1, 150) + ", " +
    _.random(1, 150) + ")";
  var lineColor = textRgb.colorHex();
  var img = gm(imageW, imageH, '#fff')
    .fill("#fff")
    .stroke("black", 1)
    .autoOrient();

  $codeSet = '2345678abcdefhijkmnpqrstuvwxyz';
  for (var $i = 0; $i < 10; $i++) {
    for (var $j = 0; $j < 5; $j++) {
      var rgb = "RGB(" + _.random(150, 255) + ", " + _.random(150, 255) +
        ", " + _.random(150, 255) + ")";
      var col = rgb.colorHex();
      img.stroke(col);
      img.drawText(_.random(-10, imageW), _.random(-10, imageH), $codeSet[_.random(
        0,
        29)]);
    }
  }
  img.stroke("#ffffff");
  for (var i = 0; i < length; i++) {
    img.font('./ttfs/' + _.random(1, 6) + '.ttf', fontSize);
    var textRgb = "RGB(" + _.random(1, 150) + ", " + _.random(1, 150) + ", " +
      _.random(1, 150) + ")";
    var col = textRgb.colorHex();
    img.stroke(col);
    var index = _.random(0, text.length - 1);
    var code = text[index];
    verifyCode += code;
    img.drawText(5 + i * 18, 22, code);
  };
  console.log(verifyCode);
  req.session.verifyCode = verifyCode.toUpperCase();
  img.toBuffer('png', function(err, buffer) {
    if (err) {
      res.status(400).end();
      return;
    }
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  });
}

//十六进制颜色值域RGB格式颜色值之间的相互转换

//-------------------------------------
//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function() {
  var that = this;
  if (/^(rgb|RGB)/.test(that)) {
    var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    var strHex = "#";
    for (var i = 0; i < aColor.length; i++) {
      var hex = Number(aColor[i]).toString(16);
      if (hex === "0") {
        hex += hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = that;
    }
    return strHex;
  } else if (reg.test(that)) {
    var aNum = that.replace(/#/, "").split("");
    if (aNum.length === 6) {
      return that;
    } else if (aNum.length === 3) {
      var numHex = "#";
      for (var i = 0; i < aNum.length; i += 1) {
        numHex += (aNum[i] + aNum[i]);
      }
      return numHex;
    }
  } else {
    return that;
  }
};
