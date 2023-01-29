// NOTE: View - базовая

export default class View extends HTMLElement {
  constructor () {
    super();

    this.insertAdjacentHTML('beforeend', this.createHtml(...arguments));
  }

  createHtml() {
    void arguments;

    return '';
  }

  // NOTE: Анимация - реализация потрясывания элемента
  /**
   * @param {KeyframeAnimationOptions} [options]
   */
  shake(options) {
    const keyframes = {
      transform: [0, -5, 0, 5, 0].map((value) => `translateX(${value}px)`)
    };

    return this.animate(keyframes, {
      duration: 150,
      iterations: 4,
      ...options
    });
  }

  // NOTE: Анимация - Добавления и исчезновения
  /**
   * @param {KeyframeAnimationOptions} [options]
   * @param {PropertyIndexedKeyframes} [extraKeyframes]
   */
  fadeIn(options, extraKeyframes) {
    const keyframes = {
      opacity: [0, 1],
      ...extraKeyframes
    };

    return this.animate(keyframes, {
      duration: 300,
      easing: 'ease',
      fill: 'both',
      ...options
    });
  }

  // NOTE: Анимация - смещение влево
  /**
   * @param {KeyframeAnimationOptions} [options]
   */
  fadeInLeft(options) {
    return this.fadeIn(options, {
      transform: ['translateX(40px)', 'none']
    });
  }

  // NOTE: Анимация - смещение вправа
  /**
   * @param {KeyframeAnimationOptions} [options]
   */
  fadeInRight(options) {
    return this.fadeIn(options, {
      transform: ['translateX(-40px)', 'none']
    });
  }

  static get localName() {
    return this.name.replace(/(?!^)[A-Z]/g, '-$&').toLowerCase();
  }

  static toString() {
    return this.localName;
  }
}
