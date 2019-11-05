<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="level-one" v-for="item1 in scope.row.children" :key=item1.id>
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key=item2.id>
                  <el-col :span="5">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag closable type="danger"  v-for="item3 in item2.children" :key=item3.id @click="removeById(scope.row.id,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.id)"
            >删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%" @close="addRolesClose">
      <el-form :model="addRoles" :rules="addRolesRlue" ref="addRolesRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改角色" :visible.sync="editdialogVisible" width="50%" @close="editDialogClosed">
      <el-form ref="editRolesRef" :model="editRoles" :rules="editRolesRlue" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editUserInfo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { async } from "q";
export default {
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      addRoles: {
        roleName: "",
        roleDesc: ""
      },
      addRolesRlue: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      editdialogVisible: false,
      editRoles: {},
      editRolesRlue: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
    },
    addRolesClose() {
      this.$refs.addRolesRef.resetFields();
    },
    addUser() {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRoles);
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败");
        }
        this.dialogVisible = false;
        this.getRolesList();
        this.$message.success("添加角色成功");
      });
    },
    async showDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("查询角色失败");
      }
      this.editRoles = res.data;
      this.editdialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editRolesRef.resetFields();
    },
    editUserInfo() {
      this.$refs.editRolesRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editRoles.roleId,
          {
            roleName: this.editRoles.roleName,
            roleDesc: this.editRoles.roleDesc
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改角色失败");
        }
        this.editdialogVisible = false;
        this.getRolesList();
        this.$message.success("修改角色成功");
      });
    },
    async removeUser(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => console.log(err));
      if (confirmResult != "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getRolesList();
    },
    async removeById(roleId,rightId){
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => console.log(err));
      if(confirmResult!='confirm') {
        return this.$message.info('取消了删除')
      }
      const {data:res} = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
      if(res.meta.status!=200) {
        return this.$message.error('删除权限失败')
      }
      this.getRolesList()
      this.$message.success('删除权限成功')
    }
  }
};
</script>

<style>
.el-tag{
    margin:7px;
}
.el-icon-caret-right {
  margin-left: 15px;
}
.level-one {
  border-bottom: 1px solid #ccc;
}
</style>