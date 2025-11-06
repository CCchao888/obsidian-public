
# 1 vue核心
## 1.1 初始vue

1. 想让Vue工作，就必须创建一个Vue实例，且要传入一个配置对象；
	1. 配置对象有 el, data 等等；el 说明挂载到哪一个容器/标签
2. root容器里的代码依然符合html规范，只不过混入了一些特殊的Vue语法；
3. root容器里的代码被称为【Vue模板】；
4. Vue实例和容器是一一对应的；
5. 真实开发中只有一个Vue实例，并且会配合着组件一起使用；
6. {{xxx}}中的xxx要写js表达式，且xxx可以自动读取到data中的所有属性；
7. 一旦data中的数据发生改变，那么模板中用到该数据的地方也会自动更新；

> [!NOTE] 注意区分：js表达式 和 js代码（语句）
>
> 1.表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方：
> (1).a
> (2).a+b
> (3). demo(1)
> (4). x === y ？ 'a' : 'b
> 2.js代码（语句）
> (1).if(）}
> (2). for(){}

data与el的2种写法
1. el有2种写法
	(1).newVue时候配置ei属性。
   （2）.先创建Vue实例，随后再通过vm.$mount（‘#root'）指定el的值。
2. data有2种写法
	(1).对象式
	(2).函数式
如何选择：目前哪种写法都可以，以后学习到组件时，`data必须使用函数式`，否则会报错。
3. 一个重要的原则：
由Vue管理的函数，**一定不要写箭头函数，一旦写了箭头函数，this就不再是Vue实例了**。


MVVM模型
1. M:模型（Model）：data中的数据
2. V:视图（View）：模板代码
3. VM：视图模型（ViewModel）：Vue实例
观察发现：
4. data中所有的属性，最后都出现在了vm（vue实例一般命名vm）身上。
5. vm身上所有的属性及Vue原型上所有属性，在Vue模板中都可以直接使用。

## 1.2 vue模板语法
Vue模板语法有2大类：
1. 插值语法：
	功能：用于`解析标签体内的`内容。
	写法：{{xxx}，xxx是 js表达式，且可以直接读取到data中的所有属性。
2. 指令语法：
	功能：用于`解析标签`（包括：标签属性、标签体内容、绑定事件。···.）
	举例：v-bind:href=xxx” 或简写为 :href=xxx"，xxx同样要写is表达式。
	且可以直接读取到data中的所有属性。
	备注：Vue中有很多的指令，且形式都是：v-？？？



## 1.3 数据绑定
Vue中有2种数据绑定的方式：
1. 单向绑定（v-bind)：数据只能从data流向页面。
2. 双向绑定（v-model）：数据不仅能从data流向页面，还可以从页面流向data。
	备注：
	1.双向绑定一般都应用在表单类元素上（如：input、select等用户输入有value值的输入类元素）
	2.v-model:value 可以简写为 v-model，因为v-model默认收集的就是`value`值。

## 1.4 数据处理


## 1.6 事件处理
事件的基本使用：
1. 使用v-on:xxx或I@xxx绑定事件，其中xxx是事件名；
2. 事件的回调需要配置在methods对象中，最终会在vm上；
3. methods中配置的函数，不要用箭头函数！否则this就不是vm了；
4. methods中配置的函数，都是被Vue所管理的函数，this的指向是vm 或 组件实例对象；
5. @click="demo" 和 @click="demo($event)" 效果一致，但后者可以传参;


# 2 vue组件化编程

## 2.1 模块与组件化
### 2.1.1 模块

Vue中使用组件的三大步骤：
1. 定义组件(创建组件)
2. 注册组件
3. 使用组件（写组件标签）

如何定义一个组件？
使用vue.extend（options）创建，其中options和newVue（options）时传入的那个options几乎一样，但也有点区别；
区别如下：el不要写，为什么？
1. 最终所有的组件都要经过一个vm的管理，由vm中的el决定服务哪个容器。
2. data必须写成函数，为什么？避免组件被复用时，数据存在引用关系。
备注：使用template可以配置组件结构。

如何注册组件？
1.局部注册：靠newVue的时候传入Eomponents选项
2.全局注册：靠Vue.component（‘组件名’，组件）
三、编写组件标签：


几个注意点：
1.关于组件名：
一个单词组成：
第一种写法（首字母小写）：school
第二种写法（首字母大写）：School
多个单词组成：
第一种写法（kebab-case命名）：my-school
第二种写法（CamelCase命名）：MySchool （需要Vue脚手架支持）
备注：
（1）.组件名尽可能回避HTML中已有的元素名称，例如：h2、H2都不行。
（2）.可以使用name配置项指定组件在开发者工具中呈现的名字。
2.关于组件标签：
第一种写法：<school></school>
第二种写法：<school/>
备注：不用使用脚手架时，《school/>会导致后续组件不能渲染。
3.一个简写方式：
const school = Vue.extend（options） 可简写为：const school = options


关于VueComponent:
1.school组件本质是一个名为VueComponent的构造函数，且不是程序员定义的，是Vue。extend生成的。
2.我们只需要写<school/>或<school×/school>，Vue解析时会帮我们创建school组件的实例对象，
即Vue帮我们执行的：new VueComponent（options）。
3.特别注意：每次调用vue.extend，返回的都是一个全新的VueComponent！！！！
4.关于this指向：
(1).组件配置中：
data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是【VueComponent实例对象】。
(2).new Vue（）配置中：
data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是【Vue实例对象】。
5.VueComponent的实例对象，以后简称vc（也可称之为：组件实例对象）。
Vue的实例对象，以后简称vm。