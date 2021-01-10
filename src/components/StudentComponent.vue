<template>
  <div>
    <a-button type="primary" class="add-btn" @click="showModal">Add</a-button>
    <a-table :columns="columns" :data-source="studentList" bordered>
      <template
        v-for="col in ['departmentName','name', 'sex', 'age']"
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
      <a-form-model ref="ruleForm" :model="studentInfo" v-bind="layout">
        <a-form-model-item label="院系" prop="region">
          <a-select v-model="studentInfo.departmentId" placeholder="please select your zone">
            <a-select-option :value="item.id" v-for="item in this.department" :key="item.id">
              {{item.name}}
            </a-select-option>       </a-select>

        </a-form-model-item>
        <a-form-model-item label="姓名">
          <a-input v-model="studentInfo.name" />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="region">
          <a-select v-model="studentInfo.sex" placeholder="please select your zone">
            <a-select-option value="男">
              男
            </a-select-option>
            <a-select-option value="女">
              女
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="年龄">
          <a-input v-model="studentInfo.age" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
  const columns = [
    {
      title: '院系',
      dataIndex: 'departmentName',
      width: '20%',
      scopedSlots: { customRender: 'departmentName' },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: '20%',
      scopedSlots: { customRender: 'name' },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: '20%',
      scopedSlots: { customRender: 'sex' }
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: '10%',
      scopedSlots: { customRender: 'age' },
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
        studentList:[],
        columns,
        editingKey: '',
        //modal
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
        //form
        studentInfo: {
          departmentId: '',
          name: '',
          sex: '',
          age: '',
        },
        layout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        },
        course:[],
        teacher:[],
        department:[]
      };
    },
    mounted() {
      this.initStudentList();
    },
    methods: {
      handleChange(value, key, column) {
        const newData = [...this.studentList];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.studentList = newData;
        }
      },
      edit(key) {
        const newData = [...this.studentList];
        const target = newData.filter(item => key === item.key)[0];
        this.editingKey = key;
        if (target) {
          target.editable = true;
          this.studentList = newData;
        }
      },
      save(key) {
        const newData = [...this.studentList];
        const target = newData.filter(item => key === item.key)[0];
        this.axios.put("http://localhost:8080/v1/student/item",{
          id: target.key,
          departmentName: target.departmentName,
          name: target.name,
          sex: target.sex,
          phone: target.phone,
        }).then(res => {
          this.editingKey = '';
          this.initStudentList();
        })
      },
      deleteItem(key) {
        let param = {id : key}
        this.axios.delete("http://localhost:8080/v1/student/item", {params: param}).then(res => {
          this.initStudentList();
        })
      },
      cancel(key) {
        this.editingKey = '';
        this.initStudentList();
      },
      //modal
      async showModal() {
        this.studentInfo = {}
        this.visible = true;
        await this.initstudentInfo();
      },
      handleOk(e) {
        this.axios.post("http://localhost:8080/v1/student/item",{
          departmentId: this.studentInfo.departmentId,
          name: this.studentInfo.name,
          sex: this.studentInfo.sex,
          age: this.studentInfo.age,
        }).then(response => {
          this.visible = false;
          this.initStudentList();
        })
      },
      handleCancel(e) {
        this.visible = false;
      },
      initStudentList() {
        this.axios.get("http://localhost:8080/v1/student/list").then(res => {
          this.studentList = res.data.map(item => {
            return {
              key: item.id,
              departmentName: item.departmentName,
              name: item.name,
              sex: item.sex,
              age: item.age
            }
          })
        })
      },
      async initstudentInfo() {
        await this.axios.get("http://localhost:8080/v1/department/list").then(res => {
          this.department = res.data.data;
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
