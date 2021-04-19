<template>
<card style="border-bottom: 3px inset #f96332; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
   <template slot="header">
          <h5 class="card-category">
            Administrar Ramas</h5>
            <slot name="header"></slot>
            <slot name="Agregar Usuario">
              <div v-show="permission">
              
                  <button class="login100-form-btn-simple" v-b-modal.add-modal><i class="mdi mdi-plus" style="font-size:19px;margin-right: 5px;"></i>Nueva</button>
 
            </div>
            </slot>

            <!-- <button @click="detailsFilter = !detailsFilter">Filtros Detalles</button> -->
          
        </template>
  <el-table
    :data="tableData">
    <el-table-column prop="id" label="#" >
    </el-table-column>
    <el-table-column prop="name" label="Nombre"  >
    </el-table-column>
    <el-table-column prop="description" label="Descripcion"  >
    </el-table-column>
    <el-table-column prop="code" label="Codigo"  >
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
      <BranchForm :edit="false" @eventSaved="closeModal()" />
    </b-modal>
<b-modal id="edit-modal" title="Edit Calendar Event" hide-footer ref="edit-modal">
      <BranchForm :edit="true" :BranchObject="BranchObject" @eventSaved="closeModal()" />
    </b-modal>

  </card>
</template>






<script>
import config from "../../config";
import axios from "axios"; 
import { Table, TableColumn, Popover, Tag, Button } from "element-ui";
import NotificationTemplate from "../Notifications/NotificationTemplate";
import BaseAlert from "../../components/BaseAlert";
import BranchForm from "../../components/BranchForm";

  
const URL = config.url.URL_API;

function buildURL(api, resource = "") {
  if (api == "URL_API") {
    return URL + resource;
  }
  
}


  export default {
       components: {
    BaseAlert,
    BranchForm,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Popover.name]: Popover,
    [Tag.name]: Tag,
    [Button.name]: Button
  },
    data() {
      return {
        BranchObject: {},
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
this.showallbranch();

  

    },
    methods: {
      go_to_link(){
this.$router.push('/creauser');
      },
      showallbranch(){
        let branch = [];
        const AuthToken = 'Bearer ' + localStorage.getItem('token');

        axios.get(buildURL("URL_API", "branch"),{headers:{ 
            'Authorization': AuthToken,
         }})
        .then(res => {
          this.tableData =[]
         for (let i = 0; i < res.data.length; i++) {
        
             
       branch={
              id: res.data[i].id,
              name: res.data[i].name,
              description: res.data[i].description,
              code: res.data[i].code
              };

             this.tableData.push(branch);
             console.log(this.tableData)
       
            

           
         }
         

        }).catch(err => console.log(err));
      },



      closeModal() {
      this.$refs["add-modal"].hide();
      this.$refs["edit-modal"].hide();
      this.BranchObject = {};
      this.showallbranch();
    },
      openEditModal(index,tabledata) {
      let { id, name,description, code} = tabledata[index];
      this.BranchObject = { id, name,description, code};
      console.log(this.BranchObject);
      this.$refs["edit-modal"].show();
    },
      handleCancel(index, row) {

        axios.get(buildURL("URL_API", "deactivateUser/"+ index))
        .then(res => {
 this.$notify({
            message:'Eliminado exitosamente',
            title: this.name_app,
            component: NotificationTemplate,
            icon: "tim-icons icon-bell-55",
            type: "danger",
            timeout: 4000
          });
          this.showallbranch();
        }).catch(err=>console.log(err));

        
      },
      handleDelete(index, row) {

        axios.get(buildURL("URL_API", "deactivateUser/"+ index))
        .then(res => {
 this.$notify({
            message:'Eliminado exitosamente',
            title: this.name_app,
            component: NotificationTemplate,
            icon: "tim-icons icon-bell-55",
            type: "danger",
            timeout: 4000
          });
          this.showallbranch();
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