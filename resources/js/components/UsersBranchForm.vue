<template>
  <div>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <b-form @submit.prevent="onSubmit" novalidate>
        <b-form-group label="Email" label-for="email">
          <ValidationProvider name="email" rules="required" v-slot="{ errors }">
            <b-form-select v-model="selectedu" :options="optionsu" :disabled='edit'></b-form-select>
              
            <b-form-invalid-feedback :state="errors.length == 0">Email is required</b-form-invalid-feedback>
          </ValidationProvider>
        </b-form-group>
        <b-form-group label="Branch" label-for="branch">
          <ValidationProvider name="branch" rules="required" v-slot="{ errors }">
            <b-form-select v-model="selectedb" :options="optionsb"></b-form-select>
              
            <b-form-invalid-feedback :state="errors.length == 0">Branch is required</b-form-invalid-feedback>
          </ValidationProvider>
        </b-form-group>
        <b-form-group label="Roles" label-for="role">
          <ValidationProvider name="role" rules="required" v-slot="{ errors }">
            <b-form-select v-model="selectedr" :options="optionsr"></b-form-select>
            
              
            <b-form-invalid-feedback :state="errors.length == 0">Role is required</b-form-invalid-feedback>
          </ValidationProvider>
        </b-form-group>
    

        <div class="row">
          <div class="col-6">
            <button type="submit" variant="primary" class="login100-form-btn-simple">Guardar</button>
          </div>
          <div class="col-6">
            <button type="button" variant="primary" class="login100-form-btn-simple" @click="CloseModal">Cancelar</button>
          </div>
        </div>
        
        
       
      </b-form>
    </ValidationObserver>
  </div>
</template>
<script>
import axios from "axios"; 
import config from "../config";
import NotificationTemplate from "../pages/Notifications/NotificationTemplate";


const URL = config.url.URL_API;

function buildURL(api, resource = "") {
  if (api == "URL_API") {
    return URL + resource;
  }
  
}

export default {
  name: "UsersBranchForm",
  props: {
    edit: Boolean,
    UserObject: Object,
    
  },

  
  data() {
    return {
      name_app: localStorage.getItem('name_app'),
      selectedu: null,
      selectedb: null,
      selectedr: null,
      optionsu: [{ value: null, text: 'Seleccione un trabajador' },],
      optionsb: [{ value: null, text: 'Seleccione una rama' },],
      optionsr: [{ value: null, text: 'Seleccione un Rol' },],
      data:{},
      form: {},
      eventColor:'',
       
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      },

    };
  },
  watch: {
    UserObject: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        this.form = val || {};
      }
    }
  },
  created(){
   this.getUsers();
   this.getBranches();
   this.getRole();
    },
  components: {
        
        
      },
  methods: {
    async getUsers(){
      console.log(this.form);
      if (this.edit) {
        this.selectedu= this.form.id,
        this.optionsu=[{ value: this.form.id, text: this.form.email},]
      }
      else{
        this.selectedu= null
        this.optionsu=[{ value: null, text: 'Seleccione un trabajador'},]
      }
      const AuthToken = 'Bearer ' + localStorage.getItem('token');
     axios.get(buildURL("URL_API", "user/listusers"),{headers:{ 
        "Authorization": AuthToken
      }}).then(res => {
          
        
         for (let i = 0; i < res.data.users.length; i++) {
             this.optionsu.push({
              value: res.data.users[i].id,
              text: res.data.users[i].email
              });
         }
         

        }).catch(err => console.log(err));
    },
    async getBranches(){
      if (this.edit) {
        this.selectedb= this.form.branches_id,
        this.optionsb=[{ value: this.form.branches_id, text: this.form.branches_name},]
      }
      else{
        this.selectedb= null
        this.optionsb=[{ value: null, text: 'Seleccione una rama'},]
      }
      
      const AuthToken = 'Bearer ' + localStorage.getItem('token');
     axios.get(buildURL("URL_API", "branch"),{headers:{ 
        "Authorization": AuthToken
      }}).then(res => {
          
        
         for (let i = 0; i < res.data.length; i++) {

             this.optionsb.push({
              value: res.data[i].id,
              text: res.data[i].name
              });
         }
         

        }).catch(err => console.log(err));
    },
    async getRole(){
       if (this.edit) {
        this.selectedr= this.form.role_id,
        this.optionsr=[{ value: this.form.role_id, text: this.form.role_name},]
      }
      else{
        this.selectedr= null
        this.optionsr=[{ value: null, text: 'Seleccione una rol'},]
      }
      const AuthToken = 'Bearer ' + localStorage.getItem('token');
     axios.get(buildURL("URL_API", "role"),{headers:{ 
        "Authorization": AuthToken
      }}).then(res => {
          
        
         for (let i = 0; i < res.data.length; i++) {

             this.optionsr.push({
              value: res.data[i].id,
              text: res.data[i].name
              });
         }
         

        }).catch(err => console.log(err));
    },
    async onSubmit() {
        const AuthToken = 'Bearer ' + localStorage.getItem('token');
      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        return;
      }
  

      
      if (this.edit) {
        // await this.editCalendar(this.form);
        this.data.usuario_id = this.selectedu
        this.data.branches_id = this.selectedb
        this.data.role_id = this.selectedr
        this.data.modfromnegocio = true

        axios.put(buildURL("URL_API", "user/"+this.selectedu), this.data,{headers:{ 
        "Authorization": AuthToken
      }});
      

      } else {
        // await this.addCalendar(this.form);
        this.data.usuario_id = this.selectedu
        this.data.branches_id = this.selectedb
        this.data.role_id = this.selectedr

        axios.post(buildURL("URL_API", "user"), this.data,{headers:{ 
        "Authorization": AuthToken
      }});
      }
      this.$notify({
            message:'Actualizado exitosamente',
            title: this.name_app,
            component: NotificationTemplate,
            icon: "tim-icons icon-bell-55",
            type: "success",
            timeout: 4000
          });
      this.$emit("eventSaved");
    },

    async CloseModal() {
      this.$emit("eventSaved");
    },

  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.button {
  margin-right: 10px;
}
.form-control{
color: #525f7f;
}
.custom-select{
  color: rgb(70, 70, 70);
}
</style>