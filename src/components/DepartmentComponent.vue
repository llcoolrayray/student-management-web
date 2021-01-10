<template>
  <div>
    <a-button type="primary" class="add-btn" @click="showModal">Add</a-button>
    <a-table :columns="columns" :data-source="deptData" bordered>
      <template
        v-for="col in ['name', 'address', 'phone']"
        :slot="col"
        slot-scope="text, record, index"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">Save</a>
          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
            <a>Cancel</a>
          </a-popconfirm>
        </span>
          <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">Edit</a>
          <a-divider type="vertical" />
          <a @click="() => deleteItem(record.key)">Delete</a>
        </span>
        </div>
      </template>
    </a-table>

    <a-modal
      title="Title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="dept" v-bind="layout">
        <a-form-model-item has-feedback label="院系名称">
          <a-input v-model="dept.name"/>
        </a-form-model-item>
        <a-form-model-item has-feedback label="地址">
          <a-input v-model="dept.address" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="联系电话">
          <a-input v-model="dept.phone" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '院系名称',
    dataIndex: 'name',
    width: '25%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '地址',
    dataIndex: 'address',
    width: '15%',
    scopedSlots: { customRender: 'address' },
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: '40%',
    scopedSlots: { customRender: 'phone' },
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];

export default {
  data() {
    return {
      deptData:[],
      columns,
      editingKey: '',
      //modal
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      //form
      dept: {
        name: '',
        address: '',
        phone: '',
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
    };
  },
  mounted() {
    this.initDeptList();
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.deptData];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.deptData = newData;
      }
    },
    edit(key) {
      const newData = [...this.deptData];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.deptData = newData;
      }
    },
    save(key) {
      const newData = [...this.deptData];
      const target = newData.filter(item => key === item.key)[0];
      this.axios.put("http://localhost:8080/v1/department/item",{
        id: target.key,
        name: target.name,
        address: target.address,
        phone: target.phone,
      }).then(res => {
        this.editingKey = '';
        this.initDeptList();
      })
    },
    deleteItem(key) {
      let param = {id : key}
      this.axios.delete("http://localhost:8080/v1/department/item", {params: param}).then(res => {
        this.initDeptList();
      })
    },
    cancel(key) {
      this.editingKey = '';
      this.initDeptList();
    },
    //modal
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.axios.post("http://localhost:8080/v1/department/item",{
        name: this.dept.name,
        address: this.dept.address,
        phone: this.dept.phone,
      }).then((response) => {
        this.visible = false;
        this.initDeptList();
      })

    },
    handleCancel(e) {
      console.log('Clicked cancel button');
      this.visible = false;
    },
    initDeptList() {
      this.axios.get("http://localhost:8080/v1/department/list").then(res => {
          res.data.data.map(item => {
            this.deptData.push({
              key: item.id,
              name: item.name,
              address: item.address,
              phone: item.phone,
            })
          })
      })
    }
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.add-btn {
  float: right;
  margin-bottom: 8px;
  z-index: 9999;
}
</style>
