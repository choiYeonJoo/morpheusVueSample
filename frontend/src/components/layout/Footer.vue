<template>
  <div class="l-footer">
    <div class="footer">
      <ul>
        <li :class="{ 'is-active': footerStyle === 'menu1' }">
          <router-link to="/menu1">
            <p><i :class="{ 'is-active': footerStyle === 'menu1' }"></i></p>
            <p class="ft-size-xxsmall">메뉴1</p>
          </router-link>
        </li>
        <li :class="{ 'is-active': footerStyle === 'menu2' }">
          <router-link to="/menu2">
            <p><i :class="{ 'is-active': footerStyle === 'menu2' }"></i></p>
            <p class="ft-size-xxsmall">메뉴2</p>
          </router-link>
        </li>
        <li :class="{ 'is-active': footerStyle === 'menu3' }">
          <router-link to="/menu3">
            <p><i :class="{ 'is-active': footerStyle === 'menu3' }"></i></p>
            <p class="ft-size-xxsmall">메뉴3</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "Footer",
  props: {
    footerStyle: {
      type: String,
      default: ""
    }
  }
};
</script>
