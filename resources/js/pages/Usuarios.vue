<template>
<card style="border-bottom: 3px inset #f96332; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
<template slot="header">
          <h5 class="card-category">
            Administrar Usuarios</h5>
            <slot name="header"></slot>
            <slot name="Agregar Usuario">
              <div v-show="permission">
              <button class="login100-form-btn-simple" v-b-modal.add-modal><i class="mdi mdi-account-plus" style="font-size:19px;margin-right: 5px;"></i>Nueva</button>
            </div>
            </slot>

            <!-- <button @click="detailsFilter = !detailsFilter">Filtros Detalles</button> -->
          
        </template>
  <el-table
    :data="tableData">
    <el-table-column prop="name" label="Name">
    </el-table-column>
    <el-table-column prop="email" label="Email">
    </el-table-column>
    <el-table-column prop="role" label="Rol">
    </el-table-column>
    <el-table-column
      label="Verificado">
      <template slot-scope="scope">
        <div v-if="scope.row.status == '1'">
<h4><i class="mdi mdi-shield-check" style="font-size:19px; color:rgb(34, 202, 3);"></i> Verificado</h4>
        </div>
         <div v-else>
<h4><i class="mdi mdi-alert-outline" style="font-size:19px; color:#FDB913;"></i> No Verificado</h4>
        </div>
        
        
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="Acciones"
      >
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="openEditModal(scope.$index, tableData)"
          type="text"
          size="small">
          Editar
        </el-button>
        <div v-show="permission">
        <el-button
          @click.native.prevent="handleCancel(scope.$index, tableData)"
          type="text"
          size="small">
          Desactivar
        </el-button>
        <el-button
          @click.native.prevent="handleDelete(scope.$index, tableData)"
          type="text"
          size="small">
          Eliminar
        </el-button>
        </div>
      </template>
    </el-table-column>


    
  </el-table>

    <b-modal id="add-modal" title="Add Calendar Event" hide-footer ref="add-modal">
      <UsersForm :edit="false" @eventSaved="closeModal()" />
    </b-modal>
<b-modal id="edit-modal" title="Edit Calendar Event" hide-footer ref="edit-modal">
      <UsersForm :edit="true" :UserObject="UserObject" @eventSaved="closeModal()" />
    </b-modal>
  </card>
</template>






<script>
import config from "../config";
import axios from "axios"; 
import { Table, TableColumn, Popover, Tag, Button } from "element-ui";
import NotificationTemplate from "./Notifications/NotificationTemplate";
import BaseAlert from "../components/BaseAlert";
import UsersForm from "../components/UsersForm";


const URL_API = config.url.URL_API;
/**
 * Arma la URL de el servicio
 */
function buildURL(api, resource = "") {
  return URL_API + resource;
}

  export default {
       components: {
    UsersForm,
    BaseAlert,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Popover.name]: Popover,
    [Tag.name]: Tag,
    [Button.name]: Button
  },
    data() {
      return {
        UserObject: {},
        name_app: localStorage.getItem('name_app'),
        permission:localStorage.getItem('role') === 'Administrator' ? true : false,
          errors: {},
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      },

        tableData: []
      }
    },
    created(){
this.showallusers();

  

    },
    methods: {
      go_to_link(){
this.$router.push('/creauser');
      },
      showallusers(){
        const AuthToken = 'Bearer ' + localStorage.getItem('token');
        let user = [];
        axios.get(buildURL("URL_API", "user"),{headers:{ 
            'Authorization': AuthToken,
         }})
        .then(res => {
           console.log(res.data);
           console.log(res.data.users);
           console.log(res.data.users[0]);
           console.log(res.data.users[0].roles);
         for (let i = 0; i < res.data.users.length; i++) {
           if(res.data.users[i].roles[0].id == '1' || res.data.users[i].roles[0].id == '2' || res.data.users[i].roles[0].id == '3' || res.data.users[i].roles[0].id == '4' ){
             
 user={
              id: res.data.users[i].id,
              email: res.data.users[i].email,
              name: res.data.users[i].name,
              role: res.data.users[i].roles[0].name,
              // status: res.data.users[i].verification_profile[0].status_id,
             };
             this.tableData.push(user);
           
       
            

           }
         }
         console.log(this.tableData);

        }).catch(err => console.log(err));
      },


       closeModal() {
      this.$refs["add-modal"].hide();
      this.$refs["edit-modal"].hide();
      this.UserObject = {};
      this.showallbranch();
    },
      openEditModal(index,tabledata) {
      let { id, name,description, code} = tabledata[index];
      this.UserObject = { id, name,description, code};
      console.log(this.UserObject);
      this.$refs["edit-modal"].show();
    },



  
      handleCancel(index, row) {

        axios.get(buildURL("URL_API", "deactivateUser/"+ row[index].id))
        .then(res => {
 this.$notify({
            message:'Eliminado exitosamente',
            title: this.name_app,
            component: NotificationTemplate,
            icon: "tim-icons icon-bell-55",
            type: "danger",
            timeout: 4000
          });
        }).catch(err=>console.log(err));

        
      }
    }
  }
</script>
<style>
.el-table {
    background-color: #00000000;
}
.el-table th, .el-table tr {
    background-color: #00000000;
}
.el-table th, .el-table tr {
    background-color: rgba(0, 0, 0, 0);
}
/* #797b80; */
</style>
