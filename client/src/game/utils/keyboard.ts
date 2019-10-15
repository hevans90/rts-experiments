interface KeyboardItem {
  value: string;
  isDown: boolean;
  isUp: boolean;
  press?: () => void;
  holdDown?: () => void;
  release?: () => void;
  downHandler?: (event: any) => void;
  upHandler?: (event: any) => void;
  unsubscribe?: () => void;
}

export const keyboard = (
  value: string,
  press: () => void,
  release: () => void,
  holdDown?: () => void,
): KeyboardItem => {
  const key: KeyboardItem = {
    value,
    isDown: false,
    isUp: false,
    press,
    release,
    holdDown,
  };

  let holdDownHandler: number;

  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) {
        key.press();
        console.log(`${key.value} PRESSED`);
        if (key.holdDown) {
          holdDownHandler = setInterval(
            () =>
              key.holdDown
                ? (key.holdDown() as any) &&
                  console.warn(`${key.value} HELD DOWN`)
                : undefined,
            17,
          );
        }
      }
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) {
        key.release();
        console.log(`${key.value} RELEASED`);

        if (key.holdDown) {
          clearInterval(holdDownHandler);
        }
      }
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  // Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener('keydown', downListener, false);
  window.addEventListener('keyup', upListener, false);

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener);
    window.removeEventListener('keyup', upListener);
  };

  return key;
};
