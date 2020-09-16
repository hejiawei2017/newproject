<template>
  <div>
    <div>
      获取公钥的内容:
      <span>{{publicKey}}</span>
    </div>
    <div class="submit" @click="submit">点击提交</div>
  </div>
</template>
<script>
import axios from "axios";
import { JSEncrypt } from "jsencrypt";
export default {
  data() {
    return {
      publicKey: ""
    };
  },
  methods: {
    submit() {
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.publicKey);
      const encryptKey = encrypt.encrypt("1233423432456"); //使用公钥加密，得到密文
      axios.post("/nodersa/login", { password: encryptKey }).then(res => {
        console.log(res);
      });
    },
    getPublicKey() {
      return axios.get("/nodersa/getPublicKey");
    }
  },
  mounted() {
    this.getPublicKey().then(res => {
      console.log(res);
      this.publicKey = res.data.publicKey;
    });
  }
};
</script>
<style scoped>
.submit {
  width: 100px;
  height: 40px;
  text-align: center;
  background-color: blue;
  color: white;
  line-height: 40px;
  border-radius: 5px;
  cursor: pointer;
}
</style>