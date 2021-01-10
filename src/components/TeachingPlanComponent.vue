<template>
  <div>
    <a-button type="primary" class="add-btn" @click="showModal">Add</a-button>
    <a-table :columns="columns" :data-source="teachingPlanData" bordered>
      <template
        v-for="col in ['semester', 'departmentName', 'courseName', 'teacherName', 'remark']"
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
      <a-form-model ref="ruleForm" :model="teachingInfo" v-bind="layout">
        <a-form-model-item has-feedback label="学期">
          <a-input v-model="teachingInfo.semester"/>
        </a-form-model-item>
        <a-form-model-item label="院系" prop="region">
          <a-select v-model="teachingInfo.departmentId" placeholder="please select your zone">
            <a-select-option :value="item.id" v-for="item in this.department" :key="item.id">
              {{item.name}}
            </a-select-option>       </a-select>

        </a-form-model-item>
        <a-form-model-item label="课程" prop="region">
          <a-select v-model="teachingInfo.courseId" placeholder="please select your zone">
            <a-select-option :value="item.id" v-for="item in this.course" :key="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="教师" prop="region">
          <a-select v-model="teachingInfo.teacherId" placeholder="please select your zone">
            <a-select-option :value="item.id" v-for="item in this.teacher" :key="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="备注">
          <a-input v-model="teachingInfo.remark" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
  const columns = [
    {
      title: '学期',
      dataIndex: 'semester',
      width: '20%',
      scopedSlots: { customRender: 'semester' },
    },
    {
      title: '院系',
      dataIndex: 'departmentName',
      width: '20%',
      scopedSlots: { customRender: 'departmentName' },
    },
    {
      title: '课程',
      dataIndex: 'courseName',
      width: '20%',
      scopedSlots: { customRender: 'courseName' }
    },
    {
      title: '教师',
      dataIndex: 'teacherName',
      width: '10%',
      scopedSlots: { customRender: 'teacherName' },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '10%',
      scopedSlots: { customRender: 'remark' },
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
        teachingPlanData:[],
        columns,
        editingKey: '',
        //modal
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
        //form
        teachingInfo: {
          semester: '',
          departmentId: '',
          courseId: '',
          teacherId: '',
          remark: '',
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
      this.initTeachingPlanList();
    },
    methods: {
      handleChange(value, key, column) {
        const newData = [...this.teachingPlanData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.teachingPlanData = newData;
        }
      },
      edit(key) {
        const newData = [...this.teachingPlanData];
        const target = newData.filter(item => key === item.key)[0];
        this.editingKey = key;
        if (target) {
          target.editable = true;
          this.teachingPlanData = newData;
        }
      },
      save(key) {
        const newData = [...this.teachingPlanData];
        const target = newData.filter(item => key === item.key)[0];
        this.axios.put("http://localhost:8080/v1/teachingPlan/item",{
          id: target.key,
          semester: target.semester,
          departmentName: target.departmentName,
          courseName: target.courseName,
          teacherName: target.teacherName,
          remark: target.remark,
        }).then(res => {
          this.editingKey = '';
          this.initTeachingPlanList();
        })
      },
      deleteItem(key) {
        let param = {id : key}
        this.axios.delete("http://localhost:8080/v1/teachingPlan/item", {params: param}).then(res => {
          this.initTeachingPlanList();
        })
      },
      cancel(key) {
        this.editingKey = '';
        this.initTeachingPlanList();
      },
      //modal
      async showModal() {
        this.visible = true;
        await this.initTeachingInfo();
      },
      handleOk(e) {
        this.axios.post("http://localhost:8080/v1/teachingPlan/item",{
          semester: this.teachingInfo.semester,
          departmentId: this.teachingInfo.departmentId,
          courseId: this.teachingInfo.courseId,
          teacherId: this.teachingInfo.teacherId,
          remark: this.teachingInfo.remark,
        }).then(response => {
          this.visible = false;
          this.initTeachingPlanList();
        })

      },
      handleCancel(e) {
        console.log('Clicked cancel button');
        this.visible = false;
      },
      initTeachingPlanList() {
        this.axios.get("http://localhost:8080/v1/teachingPlan/list").then(res => {
          this.teachingPlanData = res.data.data.map(item => {
            return {
              key: item.id,
              semester: item.semester,
              departmentName: item.departmentName,
              courseName: item.courseName,
              teacherName: item.teacherName,
              remark: item.remark,
            }
          })
        })
      },
      async initTeachingInfo() {
        await this.axios.get("http://localhost:8080/v1/course/list").then(res => {
          this.course = res.data.data;
        })
        await this.axios.get("http://localhost:8080/v1/department/list").then(res => {
          this.department = res.data.data;
        })
        await this.axios.get("http://localhost:8080/v1/teacher/list").then(res => {
          this.teacher = res.data.data;
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
