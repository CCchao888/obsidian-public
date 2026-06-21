
# 🔍 Vue 核心概念详解：生命周期与数据管理

## 📊 Vue 核心选项对比总览

首先，通过一个表格来快速了解这些概念的区别：

| 选项 | 执行时机 | 主要用途 | 是否响应式 | 返回值 |
|------|----------|----------|------------|--------|
| **data** | 组件初始化时 | 定义响应式数据 | ✅ 是 | 必须返回对象 |
| **computed** | 依赖数据变化时 | 计算属性，基于已有数据计算新值 | ✅ 是 | 返回计算结果 |
| **methods** | 调用时执行 | 定义方法，处理业务逻辑 | ❌ 否 | 可返回任何值 |
| **watch** | 监听的数据变化时 | 监听数据变化，执行异步或复杂操作 | ✅ 是 | 无返回值 |
| **created** | 组件创建完成，DOM未挂载 | 初始化数据，调用API | 一次性 | 无返回值 |
| **mounted** | DOM挂载完成后 | 操作DOM，初始化第三方库 | 一次性 | 无返回值 |

## 🎯 一、data：组件的数据仓库

### 作用：定义组件的响应式数据

```vue
<template>
  <div>
    <p>产品名称: {{ productName }}</p>
    <input v-model="productName">
    <p>价格: {{ price }} 元</p>
    <button @click="price += 10">涨价10元</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productName: '默认产品',  // 字符串类型数据
      price: 100,              // 数字类型数据
      isAvailable: true,       // 布尔类型数据
      productList: [],         // 数组类型数据
      productInfo: {           // 对象类型数据
        category: '电子产品',
        supplier: '某供应商'
      }
    }
  }
}
</script>
```

**特点**：
- 必须是一个函数，返回一个对象
- 所有在 data 中定义的数据都是**响应式**的
- 数据变化时，视图会自动更新

## 🔄 二、computed：计算属性（智能数据）

### 作用：基于现有数据计算衍生数据

```vue
<template>
  <div>
    <p>原价: {{ price }} 元</p>
    <p>折扣价: {{ discountedPrice }} 元</p>  <!-- 使用计算属性 -->
    <p>价格描述: {{ priceDescription }}</p>  <!-- 使用计算属性 -->
    
    <input v-model="discountRate" placeholder="输入折扣率(0-1)">
  </div>
</template>

<script>
export default {
  data() {
    return {
      price: 100,
      discountRate: 0.8  // 8折
    }
  },
  
  computed: {
    // 计算折扣价（基于price和discountRate）
    discountedPrice() {
      return this.price * this.discountRate;
    },
    
    // 计算价格描述（基于多个数据）
    priceDescription() {
      if (this.discountedPrice < 50) {
        return '超值特价！';
      } else if (this.discountedPrice < 100) {
        return '优惠价格';
      } else {
        return '正常价格';
      }
    },
    
    // 权限检查的计算属性（你项目中看到的）
    hasEditPermission() {
      // 假设从Vuex或本地获取用户权限
      const userPermissions = this.$store.state.user.permissions;
      return userPermissions.includes('product_edit');
    },
    
    hasDeletePermission() {
      const userPermissions = this.$store.state.user.permissions;
      return userPermissions.includes('product_delete');
    }
  }
}
</script>
```

**computed 的特点**：
1. **缓存机制**：只有依赖的数据变化时才会重新计算
2. **响应式**：依赖的数据变化时，计算属性自动更新
3. **声明式**：像普通属性一样使用，不需要调用

## 🛠️ 三、methods：方法定义（工具函数）

### 作用：定义可以在模板或JavaScript中调用的方法

```vue
<template>
  <div>
    <button @click="addProduct">添加产品</button>
    <button @click="deleteProduct(product.id)">删除产品</button>
    
    <!-- 在模板中使用方法返回值 -->
    <p>当前时间: {{ getCurrentTime() }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [
        { id: 1, name: '产品A', price: 100 },
        { id: 2, name: '产品B', price: 200 }
      ]
    }
  },
  
  methods: {
    // 添加产品方法
    addProduct() {
      const newProduct = {
        id: Date.now(),  // 使用时间戳作为ID
        name: '新产品',
        price: 150
      };
      this.products.push(newProduct);
    },
    
    // 带参数的删除方法
    deleteProduct(productId) {
      this.products = this.products.filter(product => product.id !== productId);
    },
    
    // 返回数据的方法
    getCurrentTime() {
      return new Date().toLocaleString();
    },
    
    // 处理复杂业务逻辑的方法
    validateProduct(product) {
      if (!product.name || product.name.trim() === '') {
        this.$message.error('产品名称不能为空');
        return false;
      }
      if (product.price <= 0) {
        this.$message.error('价格必须大于0');
        return false;
      }
      return true;
    }
  }
}
</script>
```

**methods 的特点**：
1. **每次调用都执行**：没有缓存，每次调用都会重新执行
2. **适合事件处理**：按钮点击、表单提交等
3. **可以接受参数**：比 computed 更灵活

## 👀 四、watch：监听器（数据侦探）

### 作用：监听数据变化，执行异步或复杂操作

```vue
<script>
export default {
  data() {
    return {
      searchKeyword: '',        // 搜索关键词
      searchResults: [],        // 搜索结果
      isLoading: false,         // 加载状态
      selectedProduct: null,    // 选中的产品
      formData: {               // 表单数据
        name: '',
        price: 0,
        category: ''
      }
    }
  },
  
  watch: {
    // 监听搜索关键词变化，实现搜索提示
    searchKeyword: {
      handler(newKeyword, oldKeyword) {
        if (newKeyword && newKeyword !== oldKeyword) {
          this.debouncedSearch();
        }
      },
      immediate: true  // 立即执行一次
    },
    
    // 监听选中产品变化
    selectedProduct: {
      handler(newProduct) {
        if (newProduct) {
          // 当选中产品时，填充表单
          this.formData = { ...newProduct };
        }
      },
      deep: false  // 浅监听（只监听对象引用变化）
    },
    
    // 深度监听表单数据变化
    formData: {
      handler(newFormData) {
        // 表单数据变化时，自动保存草稿
        this.saveDraft();
      },
      deep: true  // 深度监听（监听对象内部属性变化）
    },
    
    // 简写形式：只监听简单数据
    isLoading(newValue) {
      if (newValue) {
        this.$message.info('正在加载...');
      }
    }
  },
  
  methods: {
    // 防抖搜索
    debouncedSearch: _.debounce(function() {
      this.performSearch();
    }, 500),
    
    performSearch() {
      this.isLoading = true;
      // 调用搜索API
      api.searchProducts(this.searchKeyword)
        .then(results => {
          this.searchResults = results;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    
    saveDraft() {
      // 保存表单草稿到本地存储
      localStorage.setItem('productDraft', JSON.stringify(this.formData));
    }
  }
}
</script>
```

**watch 的特点**：
1. **监听数据变化**：当特定数据变化时执行回调
2. **适合异步操作**：API调用、复杂计算等
3. **可以深度监听**：监听对象内部属性的变化

## ⚡ 五、生命周期钩子：created 和 mounted

### 执行时机对比

```mermaid
flowchart TD
    A[new Vue()] --> B[初始化事件和生命周期]
    B --> C[初始化数据绑定]
    C --> D[created 生命周期<br>数据已响应式，DOM未生成]
    
    D --> E[编译模板]
    E --> F[创建虚拟DOM]
    F --> G[挂载到真实DOM]
    G --> H[mounted 生命周期<br>DOM已就绪，可操作DOM]
    
    style D fill:#e1f5fe
    style H fill:#fff3e0
```

### created：组件创建完成时

```vue
<script>
export default {
  data() {
    return {
      products: [],
      userInfo: null
    }
  },
  
  created() {
    console.log('组件已创建，数据观测已完成');
    
    // 1. 调用API初始化数据
    this.fetchProducts();
    this.fetchUserInfo();
    
    // 2. 初始化定时器
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);
    
    // 3. 监听全局事件
    window.addEventListener('resize', this.handleResize);
    
    // 4. 从本地存储恢复数据
    const savedData = localStorage.getItem('appData');
    if (savedData) {
      Object.assign(this.$data, JSON.parse(savedData));
    }
  },
  
  methods: {
    async fetchProducts() {
      try {
        const response = await api.getProducts();
        this.products = response.data;
      } catch (error) {
        console.error('获取产品列表失败:', error);
      }
    },
    
    fetchUserInfo() {
      // 获取用户信息
      this.userInfo = this.$store.state.user;
    },
    
    handleResize() {
      console.log('窗口大小改变');
    },
    
    updateTime() {
      // 更新时间显示
    }
  }
}
</script>
```

### mounted：DOM挂载完成后

```vue
<template>
  <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
  <button ref="submitBtn">提交</button>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chart: null
    }
  },
  
  mounted() {
    console.log('DOM已挂载，可以访问DOM元素');
    
    // 1. 初始化图表（需要DOM元素）
    this.initChart();
    
    // 2. 操作DOM元素
    const submitBtn = this.$refs.submitBtn;
    if (submitBtn) {
      submitBtn.style.backgroundColor = '#1890ff';
    }
    
    // 3. 初始化第三方库（需要DOM）
    this.initThirdPartyLibrary();
    
    // 4. 绑定DOM事件
    document.addEventListener('click', this.handleDocumentClick);
  },
  
  methods: {
    initChart() {
      // 使用 echarts 初始化图表
      const chartDom = this.$refs.chartContainer;
      this.chart = echarts.init(chartDom);
      
      const option = {
        title: { text: '产品销售图表' },
        xAxis: { data: ['一月', '二月', '三月'] },
        yAxis: {},
        series: [{ data: [120, 200, 150], type: 'bar' }]
      };
      
      this.chart.setOption(option);
    },
    
    initThirdPartyLibrary() {
      // 初始化其他需要DOM的第三方库
    },
    
    handleDocumentClick(event) {
      console.log('文档点击事件:', event.target);
    }
  },
  
  beforeDestroy() {
    // 清理工作
    if (this.chart) {
      this.chart.dispose();
    }
    document.removeEventListener('click', this.handleDocumentClick);
    window.removeEventListener('resize', this.handleResize);
    clearInterval(this.timer);
  }
}
</script>
```

## 🎯 六、权限检验的实际应用

你项目中看到的权限检验在 computed 中的用法：

```vue
<template>
  <div>
    <!-- 使用计算属性进行权限判断 -->
    <button v-if="hasCreatePermission" @click="createProduct">新建产品</button>
    <button v-if="hasEditPermission" @click="editProduct">编辑产品</button>
    <button v-if="hasDeletePermission" @click="deleteProduct">删除产品</button>
    
    <!-- 复杂的权限组合 -->
    <div v-if="canManageProducts">
      <h3>产品管理面板</h3>
      <!-- 管理功能 -->
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    // 基本的权限检查
    hasCreatePermission() {
      return this.$store.getters.hasPermission('product:create');
    },
    
    hasEditPermission() {
      return this.$store.getters.hasPermission('product:edit');
    },
    
    hasDeletePermission() {
      return this.$store.getters.hasPermission('product:delete');
    },
    
    // 复杂的权限组合
    canManageProducts() {
      return this.hasCreatePermission || this.hasEditPermission || this.hasDeletePermission;
    },
    
    // 基于用户角色的权限
    isAdmin() {
      return this.$store.state.user.role === 'admin';
    },
    
    isManager() {
      return this.$store.state.user.role === 'manager';
    }
  },
  
  methods: {
    createProduct() {
      if (!this.hasCreatePermission) {
        this.$message.error('无创建权限');
        return;
      }
      // 创建逻辑
    }
  }
}
</script>
```

## 💡 七、使用场景总结

| 场景 | 推荐使用 | 原因 |
|------|----------|------|
| **定义数据** | data | 响应式数据存储 |
| **基于现有数据计算新值** | computed | 缓存机制，性能好 |
| **用户交互处理** | methods | 灵活，可接受参数 |
| **数据变化监听** | watch | 适合异步和复杂操作 |
| **初始化数据** | created | 组件创建后立即执行 |
| **操作DOM** | mounted | DOM已准备就绪 |

理解了这些概念的区别和联系，你就能更好地组织和编写 Vue 组件了。记住：**数据驱动视图**是 Vue 的核心思想，所有的这些选项都是为了更好地管理数据和视图的关系。