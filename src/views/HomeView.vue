<template>
  <div class="flex-box">
    <h1 class="primary--text">روابط سريعة</h1>
    <div class="d-flex flex-sm-column flex-md-row align-center justify-space-between ">
      <!-- <router-link to="/teachers" class="box">
        <v-icon>people_alt</v-icon>
        <h3>اضافة استاذ</h3>
      </router-link> -->

      <router-link to="/students" class="box mb-sm-3">
        <v-icon>groups</v-icon>
        <h3>اضافة طالب</h3>
      </router-link>

      <router-link to="/classes" class="box mb-sm-3">
        <v-icon>dashboard</v-icon>
        <h3>اضافة صفوف</h3>
      </router-link>

      <router-link to="/subjects" class="box mb-sm-3">
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
  }

  .box {
    width: 150px;
    height: 150px;
    background-color: whitesmoke;
    box-shadow: none;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-inline: 10px;
    transition: all ease-in-out 300ms;
    text-decoration: none;
    border: 1px solid rgba(black, .12);

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