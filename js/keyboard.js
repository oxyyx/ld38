;(function(LD) {
	(function(Input) {
		(function(Keyboard) {
			var activeKeys = [];

			// Easier access - easier rebindings.
			Keyboard.UP 	= 87; // W
			Keyboard.DOWN 	= 83; // S
			Keyboard.LEFT 	= 65; // A
			Keyboard.RIGHT 	= 68; // D

			Keyboard.initialize = function initialize () {
				document.removeEventListener('keydown', keyDownHandler);
				document.removeEventListener('keyup', keyUpHandler);
                document.removeEventListener('keypress', keyPressHandler);

				document.addEventListener('keydown', keyDownHandler);
				document.addEventListener('keyup', keyUpHandler);
                document.addEventListener('keypress', keyPressHandler);
			};

            Keyboard.isKeyDown = function isKeyDown(key) {
				return activeKeys[key];
			};

            function keyPressHandler(event) {
                LD.notify('keypress', event);
            }

			function keyUpHandler(event) {
                if (event.keyCode == 27) {
                    LD.notify('keyup_esc', event);
                }

				activeKeys[event.keyCode] = false;
			}

			function keyDownHandler(event) {
				activeKeys[event.keyCode] = true;
			}
		}(Input.Keyboard = Input.Keyboard || {}));
	}(LD.Input = LD.Input || {}));
}(window.LD = window.LD || {}));