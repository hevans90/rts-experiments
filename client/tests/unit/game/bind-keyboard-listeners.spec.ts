import { bindKeyboardListeners } from '@/game/bind-keyboard-listeners';
import * as keyboardApi from '@/game/utils/keyboard';
import * as PIXI from 'pixi.js';
jest.useFakeTimers();

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
    describe('ArrowUp', () => {
      beforeEach(() =>
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' })),
      );

      afterEach(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
        mockVelocityChangeCallback.mockClear();
      });

      it('should call callback with a positive velocity delta in Y upon keydown', () => {
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ dvely: 5 });
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
      });

      it('should call callback (with a small positive velocity delta in Y) every 17ms when held down', () => {
        mockVelocityChangeCallback.mockClear();
        jest.advanceTimersByTime(17);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(17);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(2);
        jest.advanceTimersByTime(68);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(6);
        jest.advanceTimersByTime(1034);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(66);
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ dvely: 2 });
      });

      it('should call callback with a hard set of 0 in Y velocity upon keydown', () => {
        mockVelocityChangeCallback.mockClear();
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({
          hardSetY: 0,
        });
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
      });
    });

    describe('ArrowDown', () => {
      beforeEach(() =>
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown' }),
        ),
      );

      afterEach(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
        mockVelocityChangeCallback.mockClear();
      });

      it('should call callback with a negative velocity delta in Y upon keydown', () => {
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ dvely: -5 });
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
      });

      it('should call callback (with a small negative velocity delta in Y) every 17ms when held down', () => {
        mockVelocityChangeCallback.mockClear();
        jest.advanceTimersByTime(17);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(17);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(2);
        jest.advanceTimersByTime(68);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(6);
        jest.advanceTimersByTime(1034);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(66);
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ dvely: -2 });
      });

      it('should call callback with a hard set of 0 in Y velocity upon keydown', () => {
        mockVelocityChangeCallback.mockClear();
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({
          hardSetY: 0,
        });
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
      });
    });

    describe('ArrowLeft', () => {
      beforeEach(() =>
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        ),
      );

      afterEach(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
        mockVelocityChangeCallback.mockClear();
      });

      it('should call callback with a positive velocity delta in X upon keydown', () => {
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ dvelx: 5 });
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
      });

      it('should call callback (with a small positive velocity delta in X) every 17ms when held down', () => {
        mockVelocityChangeCallback.mockClear();
        jest.advanceTimersByTime(17);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(17);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(2);
        jest.advanceTimersByTime(68);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(6);
        jest.advanceTimersByTime(1034);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(66);
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ dvelx: 2 });
      });

      it('should call callback with a hard set of 0 in X velocity upon keydown', () => {
        mockVelocityChangeCallback.mockClear();
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({
          hardSetX: 0,
        });
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
      });
    });

    describe('ArrowRight', () => {
      beforeEach(() =>
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        ),
      );

      afterEach(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
        mockVelocityChangeCallback.mockClear();
      });

      it('should call callback with a negative velocity delta in X upon keydown', () => {
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ dvelx: -5 });
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
      });

      it('should call callback (with a small negative velocity delta in X) every 17ms when held down', () => {
        mockVelocityChangeCallback.mockClear();
        jest.advanceTimersByTime(17);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(17);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(2);
        jest.advanceTimersByTime(68);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(6);
        jest.advanceTimersByTime(1034);
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(66);
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({ dvelx: -2 });
      });

      it('should call callback with a hard set of 0 in X velocity upon keydown', () => {
        mockVelocityChangeCallback.mockClear();
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
        expect(mockVelocityChangeCallback).toHaveBeenCalledWith({
          hardSetX: 0,
        });
        expect(mockVelocityChangeCallback).toHaveBeenCalledTimes(1);
      });
    });
  });
});
