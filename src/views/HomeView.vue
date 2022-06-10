<template>
  <div class="flex-box">
    <h1 class="primary--text">روابط سريعة</h1>
    <div
      class="
        d-flex
        flex-sm-column flex-md-row
        align-center
        justify-space-between
      "
    >
      <router-link to="/teachers" class="box" :class="IS_DISABLED">
        <v-icon>people_alt</v-icon>
        <h3>اضافة استاذ</h3>
      </router-link>

      <router-link to="/students" class="box">
        <v-icon>groups</v-icon>
        <h3>اضافة طالب</h3>
      </router-link>

      <router-link
        :class="IS_DISABLED"
        to="/courses"
        class="box"
      >
        <v-icon>menu_book</v-icon>
        <h3>اضافة كورس</h3>
      </router-link>

      <router-link
        :class="IS_DISABLED"
        to="/classes"
        class="box"
      >
        <v-icon>dashboard</v-icon>
        <h3>اضافة صفوف</h3>
      </router-link>

      <router-link
        :class="IS_DISABLED"
        to="/subjects"
        class="box"
      >
        <v-icon>library_books</v-icon>
        <h3>اضافة مواد</h3>
      </router-link>

      <router-link to="/bills" class="box">
        <v-icon>payments</v-icon>
        <h3>اضافة فواتير</h3>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",

  computed: {
    IS_DISABLED() {
      return {
        disabled: this.$store.state.user.role == "USER",
      };
    },
  },
};
</script>

<style lang="scss">
.flex-box {
  height: calc(100vh - 200px);
  width: 850px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-self: auto;
  justify-content: center;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    width: 100%;
  }

  .box {
    width: 150px;
    height: 150px;
    background-color: whitesmoke;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-inline: 10px;
    transition: all ease-in-out 300ms;
    text-decoration: none;
    border: 1px solid rgba(black, 0.02);
    border-bottom: none;
    box-shadow: 15px -20px 45px -43px hsl(240deg 100% 50% / 42%),
      -15px -20px 45px -43px hsl(240deg 100% 50% / 42%);

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      margin-bottom: 1em;
    }

    i {
      font-size: 4em;
      color: var(--v-primary-base);
      margin-bottom: 10px;
    }

    h3 {
      font-size: 1em;
      font-weight: 300;
      color: var(--v-primary-base);
    }

    &:hover {
      box-shadow: 0 10px 15px 0 rgba(black, 0.2);
      background-color: var(--v-primary-base);

      i {
        color: whitesmoke;
      }

      h3 {
        color: whitesmoke;
      }
    }
  }
}
</style>