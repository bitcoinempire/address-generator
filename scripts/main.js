'use strict';

function sha(hex) {
  return cryptocoin.Crypto.sha256(cryptocoin.convertHex.hexToBytes(hex));
}

function checksum(hex) {
  return sha(sha(hex)).substring(0, 8);
}

function generateKeyPair(privateKey) {
  // Generate the key pair from the private key
  var keyPair = Bitcoin.ECKey.fromWIF(privateKey);
  var publicKey = keyPair.pub.toHex();

  // Address
  var address = keyPair.pub.getAddress().toString();
  return { 'privateKey': privateKey, 'publicKey': publicKey, 'address': address };
}

function bitcoinMagic(base58String) {
  var inputHex = '80' + cryptocoin.convertHex.bytesToHex(cryptocoin.base58.decode(base58String)) + '01';

  // Convert it to a private key WIF
  var privateKeyHex = inputHex + checksum(inputHex);
  var privateKey = cryptocoin.base58.encode(cryptocoin.convertHex.hexToBytes(privateKeyHex));

  return generateKeyPair(privateKey);
}

function bitcoinMagicReverse(privateKey) {
  var privateKeyHex = cryptocoin.convertHex.bytesToHex(cryptocoin.base58.decode(privateKey));
  var inputHex = privateKeyHex.slice(2, privateKeyHex.length - 10);
  var base58String = cryptocoin.base58.encode(cryptocoin.convertHex.hexToBytes(inputHex));

  return base58String;
}

function resultPopulate(input) {
  var magic = bitcoinMagic(input);
  $('#privateKey').val(magic.privateKey);
  $('#address').val(magic.address);
  $('#characterCount').text('');
}

function resultEmpty() {
  $('#privateKey').val('');
  $('#address').val('');
}

function resultPopulateReverse(input) {
  var magic = bitcoinMagicReverse(input);
  $('#reverseOutput').val(magic);
}

function resultEmptyReverse() {
  $('#reverseOutput').val('');
}

var base58Legal = new RegExp('[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]');

$('#input').on('keyup', function () {
  if (!base58Legal.test(this.value)) {
    if (this.value.length == 42) {
      resultPopulate(this.value);
    } else if (this.value.length < 42) {
      resultEmpty();
      $('#characterCount').text(42 - this.value.length + ' characters remaining');
    } else {
      resultEmpty();
      $('#characterCount').text(this.value.length - 42 + ' too many characters');
    }
  } else {
    resultEmpty();
    $('#characterCount').text('You have entered invalid characters');
  }
});

$('#inputReverse').on('keyup', function () {
  if (!base58Legal.test(this.value)) {
    if (this.value.length == 51 || this.value.length == 52) {
      resultPopulateReverse(this.value);
    } else if (this.value.length < 52) {
      resultEmptyReverse();
      $('#characterCountReverse').text(52 - this.value.length + ' characters remaining');
    } else {
      resultEmptyReverse();
      $('#characterCountReverse').text(this.value.length - 52 + ' too many characters');
    }
  } else {
    resultEmptyReverse();
    $('#characterCountReverse').text('You have entered invalid characters');
  }
});