/* eslint no-param-reassign:0 */
import router from '@/router';

const CallbackController = (function () {
  const buffs = {};
  const controller = function controller(name) {
    buffs[name] = { common: [] };
    this.buffer = buffs[name];
  };
  controller.prototype = {
    batch() {
      const matchedArr = router.currentRoute.matched;
      const $vues = matchedArr[matchedArr.length - 1].instances;
      const $instance = Object.keys($vues).length === 1 ? $vues.default : $vues;
      const cbArr = this.buffer[router.app.$route.name] || [];
      this.buffer.common.map((cb) => {
        cb.apply($vues.default, arguments);
      });
      cbArr.map((cb) => {
        cb.apply($instance, arguments);
      });
    },
    set(name, cb) {
      this.buffer[name] = this.buffer[name] || [];
      this.buffer[name].push(cb);
    },
    get() {
      return this.buffer;
    },
    common(cb = function () {}) {
      this.buffer.common.push(cb);
    },
  };

  return controller;
}());

const receiver = {
  onhide: new CallbackController('onhide'),
  onrestore: new CallbackController('onrestore'),
  onback: new CallbackController('onback'),
  onpause: new CallbackController('onpause'),
  onresume: new CallbackController('onresume'),
  ondestroy: new CallbackController('ondestroy'),
};

M.onHide(function () { receiver.onhide.batch(...arguments); });
M.onRestore(function () { receiver.onrestore.batch(...arguments); });
M.onBack(function () { receiver.onback.batch(...arguments); });
M.onPause(function () { receiver.onpause.batch(...arguments); });
M.onResume(function () { receiver.onresume.batch(...arguments); });
M.onDestroy(function () { receiver.ondestroy.batch(...arguments); });

export const MCommon = function (name, cb) { receiver[name].common(cb); };
export const onHide = function (name, cb) { receiver.onhide.set(name, cb); };
export const onRestore = function (name, cb) { receiver.onrestore.set(name, cb); };
export const onBack = function (name, cb) { receiver.onback.set(name, cb); };
export const onPause = function (name, cb) { receiver.onpause.set(name, cb); };
export const onResume = function (name, cb) { receiver.onresume.set(name, cb); };
export const onDestroy = function (name, cb) { receiver.ondestroy.set(name, cb); };

window.$mcore = {
  MCommon,
  onHide,
  onRestore,
  onBack,
  onPause,
  onResume,
  onDestroy,
};
