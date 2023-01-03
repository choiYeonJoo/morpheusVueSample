/* eslint-disable */
import Vue from 'vue';

// 대문자로 자동 변경
Vue.directive('uppercase', {
  bind(el, binding, vnode) {
    const element = el.getElementsByTagName('input')[0];
    element.addEventListener('input', function () {
      element.value = element.value.replace(/[^A-Za-z]/g, '');
      element.value = element.value.toUpperCase();
      vnode.data.model.callback(element.value);
    });
  },
});

// 숫자만 입력 가능
Vue.directive('number', {
  bind(el, binding, vnode) {
    const element = el.getElementsByTagName('input')[0];
    element.addEventListener('input', function () {
      element.value = element.value.replace(/[^0-9]/g, '');
      vnode.data.model.callback(element.value);
    });
  },
});

// 숫자와 하이픈 만 입력 가능
Vue.directive('numberhypn', {
  bind(el, binding, vnode) {
    const element = el.getElementsByTagName('input')[0];
    element.addEventListener('input', function () {
      element.value = element.value.replace(/[^0123456789-]/g, '');
      vnode.data.model.callback(element.value);
    });
  },
});

// 전화번호 입력 하이픈 자동 표시
Vue.directive('phoneNumber', {
  bind(el, binding, vnode) {
    const element = el.getElementsByTagName('input')[0];
    element.addEventListener('input', function () {
      let value = element.value.replace(/[^0-9]/g, '');
      var exp = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]{3,4})([0-9]{4})/;
      var tmpvalue = exp.exec(value);
      value = tmpvalue ? tmpvalue[0] : value;
      let result = [];
      let restNumber = '';

      // 지역번호와 나머지 번호로 나누기
      if (value.startsWith('02')) {
        // 서울 02 지역번호
        result.push(value.substr(0, 2));
        restNumber = value.substring(2);
      } else if (value.startsWith('1')) {
        // 지역 번호가 없는 경우
        // 1xxx-yyyy
        restNumber = value;
      } else {
        // 나머지 3자리 지역번호
        // 0xx-yyyy-zzzz
        result.push(value.substr(0, 3));
        restNumber = value.substring(3);
      }

      if (restNumber.length === 7) {
        // 7자리만 남았을 때는 xxx-yyyy
        result.push(restNumber.substring(0, 3));
        result.push(restNumber.substring(3));
      } else {
        result.push(restNumber.substring(0, 4));
        result.push(restNumber.substring(4));
      }
      vnode.data.model.callback(result.filter((val) => val).join('-'));
    });
  },
});


// element-ui 드래그 팝업용 
// 2021.11.08
/* 작동 예
<template>
    <el-dialog
        v-dialogDrag
        ref="dialog__wrapper">
        <div class="dialog-body">
            <div class="line"
                v-dialogDragWidth="$refs.dialog__wrapper"></div>
        </div>
    </el-dialog>
</template>
*/

// v-dialogDrag: pop up drag
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
      const dialogHeaderEl = el.querySelector('.el-dialog__header');
      const dragDom = el.querySelector('.el-dialog');
      dialogHeaderEl.style.cursor = 'move';

      // Get the original attribute ie dom element.currentStyle Firefox Google window.getComputedStyle(dom element, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
      
      dialogHeaderEl.onmousedown = (e) => {
          // Press the mouse to calculate the distance between the current element and the visible area
          const disX = e.clientX - dialogHeaderEl.offsetLeft;
          const disY = e.clientY - dialogHeaderEl.offsetTop;
          
          // Get the value with px regular matching replacement
          let styL, styT;

          // Note that the value obtained for the first time in ie is the value of px after 50% movement of the component
          if(sty.left.includes('%')) {
              styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
              styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
          }else {
              styL = +sty.left.replace(/\px/g, '');
              styT = +sty.top.replace(/\px/g, '');
          };
          
          document.onmousemove = function (e) {
              // Calculate the moving distance through event delegation 
              const l = e.clientX - disX;
              const t = e.clientY - disY;

              // Move current element  
              dragDom.style.left = `${l + styL}px`;
              dragDom.style.top = `${t + styT}px`;

              //Pass out the position at this time
              //binding.value({x:e.pageX,y:e.pageY})
          };

          document.onmouseup = function (e) {
              document.onmousemove = null;
              document.onmouseup = null;
          };
      }  
  }
})

// v-dialogDragWidth
Vue.directive('dialogDragWidth', {
  bind(el, binding, vnode, oldVnode) {
      const dragDom = binding.value.$el.querySelector('.el-dialog');

      el.onmousedown = (e) => {
          
          // Press the mouse to calculate the distance between the current element and the visible area
          const disX = e.clientX - el.offsetLeft;
          
          document.onmousemove = function (e) {
              e.preventDefault(); // Disable default events on move

              // Calculate the moving distance through event delegation 
              const l = e.clientX - disX;
              dragDom.style.width = `${l}px`;
          };

          document.onmouseup = function (e) {
              document.onmousemove = null;
              document.onmouseup = null;
          };
      }  
  }
})