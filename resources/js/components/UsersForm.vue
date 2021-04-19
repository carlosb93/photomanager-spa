<template>
  <div>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <b-form @submit.prevent="onSubmit" novalidate>
        <b-form-group label="Nombre" label-for="name">
          <ValidationProvider name="name" rules="required" v-slot="{ errors }">
            <b-form-input
              :state="errors.length == 0"
              v-model="form.name"
              type="text"
              required
              placeholder="Nombre"
              name="name"
            ></b-form-input>
            <b-form-invalid-feedback :state="errors.length == 0">Nombre is required</b-form-invalid-feedback>
          </ValidationProvider>
        </b-form-group>
    
        <b-form-group label="Descripcion" label-for="description">
          <ValidationProvider name="description" rules="required" v-slot="{ errors }">
            <b-form-input
              :state="errors.length == 0"
              v-model="form.description"
              type="text"
              required
              placeholder="Descripcion"
              name="description"
            ></b-form-input>
            <b-form-invalid-feedback :state="errors.length == 0">Descripcion is required</b-form-invalid-feedback>
          </ValidationProvider>
        </b-form-group>
    
        <b-form-group label="Codigo" label-for="code">
          <ValidationProvider name="code" rules="required" v-slot="{ errors }">
            <b-form-input
              :state="errors.length == 0"
              v-model="form.code"
              type="text"
              required
              placeholder="Codigo"
              name="code"
            ></b-form-input>
            <b-form-invalid-feedback :state="errors.length == 0">Codigo is required</b-form-invalid-feedback>
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
import ColorPicker from './ColorPicker';


const URL = config.url.URL_API;

function buildURL(api, resource = "") {
  if (api == "URL_API") {
    return URL + resource;
  }
  
}

export default {
  name: "UsersForm",
  props: {
    edit: Boolean,
    UserObject: Object,
    
  },

  
  data() {
    return {
      data:{},
      form: {},
      eventColor:''
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
  components: {
        
        ColorPicker
      },
  methods: {
    async onSubmit() {
        const AuthToken = 'Bearer ' + localStorage.getItem('token');
      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        return;
      }
  

      
      if (this.edit) {
        // await this.editCalendar(this.form);
        this.data.name = this.form.name
        this.data.description = this.form.description
        this.data.code = this.form.code
        axios.put(buildURL("URL_API", "user/"+this.form.id), this.data,{headers:{ 
        "Authorization": AuthToken
      }});
      } else {
        // await this.addCalendar(this.form);
        this.form.categoria_id = 1;
        axios.post(buildURL("URL_API", "user"), this.form,{headers:{ 
        "Authorization": AuthToken
      }});
      }
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
</style>