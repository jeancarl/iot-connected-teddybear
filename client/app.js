/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
/*eslint-env node*/

/**
 * Connected Teddy bear
 * Developed by JeanCarl Bisson
 *
 * http://jeancarlbisson.com
 */
var Client = require('ibmiotf').IotfApplication;
var LCD = require('jsupm_i2clcd');
var LcdTextHelper = require('./lcd_text_helper');
var upm_grove = require('jsupm_grove');

var rotary = new upm_grove.GroveRotary(0);
var button = new upm_grove.GroveButton(2);
var myLcd = new LCD.Jhd1313m1(0);
var lcdText = new LcdTextHelper(myLcd);

var currentButtonValue = 0;
var currentDisplayValue = ['', ''];
var options = [];

// Set up the IBM IoTF device client.
var deviceClient = new require('ibmiotf').IotfDevice({
  'org': '-----', // Organization ID
  'type': 'bear',
  'id': '-----', // Device ID
  'auth-method': 'token',
  'auth-token': '-----' // Authentication Token
});

deviceClient.on('connect', function() {
	console.log('Teddy bear connected');
});

deviceClient.connect();

// Sets the two lines of text for the LCD.
function setText(line1, line2) {
	lcdText.set([line1, line2]);
	currentDisplayValue = [line1, line2];
}

function loop() {
    if(button.value() != currentButtonValue) {
      currentButtonValue = button.value();

      if(button.value() == 1) {
	       deviceClient.publish('buttonpressed', 'json', options.length > 0 ? '{"emotion":"'+currentDisplayValue[1]+'"}' : '{}');
      }

      return;
    }

	if(options.length > 0) {
	    var selectedOption = options[Math.floor((rotary.abs_value()/1024)*options.length)];

		if(currentDisplayValue[1] != selectedOption) {
			setText(currentDisplayValue[0], selectedOption);
		}
	}
}

// Read the button and rotary dial input every 1/4 second.
setInterval(loop, 250);

// Respond to device commands from the IoTF.
deviceClient.on('command', function(commandName, format, payload, topic) {
    console.log('Command :: '+commandName+' with payload : '+payload);

    var data = JSON.parse(payload);
    switch(commandName) {
      case 'interactive':
		    options = data.options;
        setText(data.text[0], options[Math.floor((rotary.abs_value()/1024)*options.length)]);
      break;
      case 'text':
        options = [];
        setText(data.text[0], data.text[1]);
      break;
    }
});
