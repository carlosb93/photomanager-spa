<template>
<div class="limiter100">
<div class="container-login100">
         <div class="wrap-login100 p-t-190 p-b-30">
		
				<form method="post" class="login100-form" v-on:submit.prevent="login" role="form">
          <div class="avatar-mask">
					<div class="login100-form-avatar">
						<img v-bind:src="logo" alt="AVATAR">
					</div>
 </div>
				

					<div class="wrap-input100 validate-input m-b-10" data-validate = "Email Requerido" style="margin-top: 50px">
						<input class="input100" type="text" v-model="loginRequest.email" placeholder="Email">
            
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-user"></i>
						</span>
					</div>

					<div class="wrap-input100 validate-input m-b-10" data-validate = "Contraseña requerida" style="margin-top: 10px">
						<input class="input100" type="password" v-model="loginRequest.password"  placeholder="Password">
            
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-lock"></i>
						</span>
					</div>
          

					<div class="container-login100-form-btn p-t-10" style="margin-top: 10px">
						<button :disabled="isProcessing" class="login100-form-btn" v-on:click="login">
							Entrar
						</button>
					</div>
					<div class="container-login100-form-btn p-t-10" style="margin-top: 10px">
						<router-link class="login100-form-btn" to="/registro">
							Registrarse
						</router-link>
					</div>

				
				</form>
		
</div>
</div>
</div>
        
     
    
  
</template>
<script>
import config from "../../config";
import axios from "axios";
import Modal from "../../components/Modal";
import NotificationTemplate from "../Notifications/NotificationTemplate";
import BaseAlert from "../../components/BaseAlert";

const URL_API = config.url.URL_API;
/**
 * Arma la URL de el servicio
 */
function buildURL(api, resource = "") {
  return URL_API + resource;
}

export default {
    name: 'login',
  components: {
     BaseAlert,
    Modal
  },
  computed: {
   
  },
  data() {
    return {
      name_app: localStorage.getItem('name_app'),
      logo:localStorage.getItem('logo_app'),
      loginModalVisible: false,
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: "",
      loginRequest: {
        email: "",
        password: ""
      },
       email:"",
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      },
      errors: {
        message: ''
      },
      isProcessing: false
    };
  },
  created(){
 this.loginModalVisible = true;

  },
  methods: {
  
    
   
    async login() {
      this.isProcessing = true;
      let formData = new FormData()
        formData.set('email',this.loginRequest.email )
        formData.append('password',this.loginRequest.password )

       await axios.post(buildURL("URL_API", "auth/login"), formData,{header:{
         "Access-Control-Allow-Origin": "*"
       }})
        .then((res) => {
          localStorage.setItem('token', res.data.token);
          this.loginModalVisible = false;
          this.$router.push('/inicio');
          this.isProcessing = false;
        })
        .catch((error) => {
       
          if(error.response.status === 422) {
             this.errors.message = error.response.data.errors.email[0];
             this.isProcessing = false;
          } if(error.response.status === 401) {
            this.isProcessing = false;
            
            this.$notify({
              
            message: 'No existe el usuario',
            title: this.name_app,
            component: NotificationTemplate,
            icon: "tim-icons icon-bell-55",
            type: "danger",
            timeout: 4000
          });
          }
        });
    }
    
  }
};

</script>
<style scoped lang="scss">
.main-panel > .content {
    padding: 78px 30px 30px 30px;
}
</style>