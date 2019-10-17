import { bindKeyboardListeners } from '@/game/bind-keyboard-listeners';
import * as keyboardApi from '@/game/utils/keyboard';
import * as PIXI from 'pixi.js';

describe('bindKeyboardListeners', () => {
  const upArrowIndicator = new PIXI.Text('');
  const downArrowIndicator = new PIXI.Text('');
  const leftArrowIndicator = new PIXI.Text('');
  const rightArrowIndicator = new PIXI.Text('');

  const mockVelocityChangeCallback = jest.fn();

  let keyboardSpy: jest.SpyInstance;
  let keyboardListeners: keyboardApi.KeyboardItem[];

  beforeEach(() => {
    keyboardSpy = jest.spyOn(keyboardApi, 'keyboard');

    expect(keyboardSpy).not.toHaveBeenCalled();
    expect(mockVelocityChangeCallback).not.toHaveBeenCalled();

    keyboardListeners = bindKeyboardListeners(
      upArrowIndicator,
      downArrowIndicator,
      leftArrowIndicator,
      rightArrowIndicator,
      mockVelocityChangeCallback,
    );
  });

  afterEach(() => {
    keyboardSpy.mockClear();
    mockVelocityChangeCallback.mockClear();
    keyboardListeners.forEach(listener => listener.unsubscribe());
  });

  it('should register the correct number of keyboard events', () => {
    expect(keyboardSpy).toHaveBeenCalledTimes(4);
  });

  describe('post-registration', () => {
    it('should correctly react to ArrowUp events', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(mockVelocityChangeCallback).toHaveBeenCalled();
      expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ dvely: 5 });
      expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
      mockVelocityChangeCallback.mockClear();

      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
      expect(mockVelocityChangeCallback).toHaveBeenCalled();
      expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ hardSetY: 0 });
      expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
    });
  });
});
