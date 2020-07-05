import Vue from 'vue'
import { 
  Button,Form,FormItem,Input,Message,
  Container,Header,Aside,Main,
  Menu,Submenu,MenuItem,
  Breadcrumb,BreadcrumbItem,
  Card,
  Row,Col,
  Table,TableColumn,
  Switch,
  Pagination,
  Tooltip,
  Dialog,
  Select,Option,
  Tag,
  MessageBox,
  Tree,
  Alert,
  Steps,Step,
  Tabs,TabPane,
  Cascader,
  CheckboxGroup,
  Checkbox,
  Upload
} from 'element-ui'
// 登入页面所需组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 主页头部组件
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
// 主页左侧导航栏组件
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
// 面包屑组件
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Cascader)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
// 将弹框组件全局挂在到VUe原形实例
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm