# diffoo - JavaScript 对象差异比较库

![npm](https://img.shields.io/npm/v/diffoo)
![npm weekly downloads](https://img.shields.io/npm/dw/diffoo)
![License](https://img.shields.io/npm/l/diffoo)

**diffoo** 是一个轻量级的 TypeScript 库，专为高效比较 JavaScript 对象的差异而设计。它不仅支持基本类型（如字符串、数字）的差异检测，还能对复杂类型（如对象、数组）进行精准比较，并提供详细的差异。通过自定义主键策略，您可以灵活应对各种数组和嵌套对象的比较场景。

---

## 目录
- [特性](#特性)
- [安装](#安装)
- [快速上手](#快速上手)
- [使用示例](#使用示例)
  - [基本类型比较](#基本类型比较)
  - [对象比较](#对象比较)
  - [数组比较（自定义主键）](#数组比较自定义主键)
  - [嵌套对象比较](#嵌套对象比较)
- [API 文档](#api-文档)
  - [DefaultPolicyFactory 类](#defaultpolicyfactory-类)
    - [方法](#方法)
    - [返回值 `DiffResult`](#返回值-diffresult)
    - [示例代码解释](#示例代码解释)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 特性
1. **支持多种类型**：涵盖基本类型（字符串、数字、布尔值）和复杂类型（对象、数组）的比较。
2. **灵活的主键配置**：可通过 `primaryKeyFields` 定义复合主键，精准匹配数组中的对象。
3. **详细的差异报告**：返回包含差异类型、原始值和比较值的结构化数据，便于分析。
4. **轻量级依赖**：仅依赖一个小型工具库，体积小、性能高，不增加额外负担。
5. **TypeScript 支持**：原生支持 TypeScript，提供完善的类型定义，提升开发体验。

---

## 安装
您可以通过以下两种方式安装 `diffoo`：

### 使用 npm
```bash
npm install diffoo
```

### 使用 yarn
```bash
yarn add diffoo
```

---

## 快速上手
下面是一个简单的示例，展示如何使用 `diffoo` 进行对象比较：

```typescript
import { DefaultPolicyFactory } from 'diffoo';

// 初始化比较策略
const policy = new DefaultPolicyFactory();

// 定义原始对象和比较对象
const origin = { name: 'Alice', age: 30 };
const comparing = { name: 'Alice', age: 31 };

// 执行比较
const result = policy.produce(origin, comparing);

// 输出差异结果
console.log(result);
/* 输出：
ObjectDiff {
  diffType: 'Update',
  diffObj: {
    age: {
      diffType: 'Update',
      originRawObj: 30,
      comparingRawObj: 31
    }
  }
}
*/
```

---

## 使用示例

### 基本类型比较
此场景用于检测字符串或数字的变化：

```typescript
import { DefaultPolicyFactory } from 'diffoo';

const policy = new DefaultPolicyFactory();

// 比较字符串
const strResult = policy.produce('Hello', 'Hello World');
console.log(strResult.diffType); // 输出: 'Update'

// 比较数字
const numResult = policy.produce(42, 43);
console.log(numResult.diffType); // 输出: 'Update'
```

### 对象比较
比较两个对象的属性差异：

```typescript
const originObj = { id: 1, name: 'Alice', active: true };
const comparingObj = { id: 1, name: 'Alice (Updated)', active: false };

const result = policy.produce(originObj, comparingObj);
console.log(result.diffObj);
/* 输出：
{
  name: {
    diffType: 'Update',
    originRawObj: 'Alice',
    comparingRawObj: 'Alice (Updated)'
  },
  active: {
    diffType: 'Update',
    originRawObj: true,
    comparingRawObj: false
  }
}
*/
```

### 数组比较（自定义主键）
比较对象数组时，通过主键（如 `id`）匹配元素，忽略顺序：

```typescript
const originArray = [
  { id: 1, value: 'A' },
  { id: 2, value: 'B' },
];
const comparingArray = [
  { id: 2, value: 'B (Updated)' },
  { id: 3, value: 'C' }, // 新增元素
];

const options = { primaryKeyFields: ['id'] };
const result = policy.produce(originArray, comparingArray, options);

console.log(result.diffObj);
/* 输出：
[
  {
    diffType: 'Update',
    originRawObj: { id: 2, value: 'B' },
    comparingRawObj: { id: 2, value: 'B (Updated)' }
  },
  {
    diffType: 'Create',
    comparingRawObj: { id: 3, value: 'C' }
  }
]
*/
```

### 嵌套对象比较
比较嵌套多层的复杂对象：

```typescript
const originNested = {
  user: {
    profile: {
      name: 'John',
      settings: { darkMode: false }
    }
  }
};
const comparingNested = {
  user: {
    profile: {
      name: 'John Doe',
      settings: { darkMode: true }
    }
  }
};

const result = policy.produce(originNested, comparingNested);
console.log(result.diffObj);
/* 输出：
{
  user: {
    diffType: 'Update',
    diffObj: {
      profile: {
        diffType: 'Update',
        diffObj: {
          name: {
            diffType: 'Update',
            originRawObj: 'John',
            comparingRawObj: 'John Doe'
          },
          settings: {
            diffType: 'Update',
            originRawObj: false,
            comparingRawObj: true
          }
        }
      }
    }
  }
}
*/
```

---

## API 文档

### DefaultPolicyFactory 类
这是一个用于创建比较策略的工厂类。

#### 方法
- `produce (origin: any, comparing: any, options?: CompareOptions): DiffResult`  
  执行对象比较，并返回差异结果。
  - `origin`：原始对象，可以是基本类型（如字符串、数字、布尔值），也可以是复杂类型（如对象、数组）。
  - `comparing`：用于比较的对象，类型需与 `origin` 兼容。
  - `options`（可选）：配置参数，支持 `primaryKeyFields: string[]` 定义数组比较的主键字段。当比较对象数组时，通过指定主键字段，可以精准匹配数组中的对象，忽略元素顺序。

#### 返回值 `DiffResult`
包含差异类型和详细信息的对象，结构如下：

```typescript
interface DiffResult {
  diffType: 'Equal' | 'Update' | 'Create' | 'Delete';
  diffObj?: Record<string, any> | any[]; // 差异详情
  originRawObj?: any; // 原始值（仅部分类型）
  comparingRawObj?: any; // 比较值（仅部分类型）
}
```
- `diffType`：表示差异的类型，有以下几种可能的值：
  - `Equal`：表示两个对象相等，没有差异。
  - `Update`：表示对象的某个属性或元素发生了更新。
  - `Create`：表示在比较对象中存在，而原始对象中不存在的元素或属性。
  - `Delete`：表示在原始对象中存在，而比较对象中不存在的元素或属性。
- `diffObj`：详细的差异信息，可能是一个对象或数组，具体取决于比较的对象类型。
- `originRawObj`：原始对象的值，仅在部分差异类型（如 `Update`）中存在。
- `comparingRawObj`：比较对象的值，仅在部分差异类型（如 `Update`、`Create`）中存在。

#### 示例代码解释
以下是一个简单的示例代码，解释如何使用 `DefaultPolicyFactory` 类的 `produce` 方法：

```typescript
import { DefaultPolicyFactory } from 'diffoo';

// 初始化比较策略
const policy = new DefaultPolicyFactory();

// 定义原始对象和比较对象
const origin = { name: 'Alice', age: 30 };
const comparing = { name: 'Alice', age: 31 };

// 执行比较
const result = policy.produce(origin, comparing);

// 输出差异结果
console.log(result);
```
在这个示例中，我们首先导入 `DefaultPolicyFactory` 类，并创建一个实例 `policy`。然后，我们定义了两个对象 `origin` 和 `comparing`，它们的 `name` 属性相同，但 `age` 属性不同。接着，我们调用 `policy.produce` 方法进行比较，并将结果存储在 `result` 变量中。最后，我们打印出 `result` 对象，查看差异信息。

---

## 贡献指南
如果您想为 `diffoo` 项目做出贡献，请按照以下步骤操作：
1. **克隆仓库**：
   ```bash
   git clone https://github.com/MPandAdev/Diffoo.git
   ```
2. **安装依赖**：
   ```bash
   npm install
   ```
3. **开发测试**：修改代码后，运行以下命令验证功能：
   ```bash
   npm test
   ```
4. **提交 PR**：请遵循代码规范，添加清晰的注释和测试用例。

---

## 许可证
本项目采用 MIT 许可证，详情请见 [LICENSE](https://github.com/MPandAdev/Diffoo/blob/main/LICENSE)。

---
---
---
---
---
---

# diffoo - JavaScript Object Difference Comparison Library

![npm](https://img.shields.io/npm/v/diffoo)
![npm weekly downloads](https://img.shields.io/npm/dw/diffoo)
![License](https://img.shields.io/npm/l/diffoo)

**diffoo** is a lightweight TypeScript library designed for efficiently comparing differences between JavaScript objects. It not only supports detecting differences in basic types (such as strings and numbers) but also enables precise comparison of complex types (such as objects and arrays), providing detailed difference reports. With a customizable primary key strategy, you can flexibly handle various comparison scenarios for arrays and nested objects.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Basic Type Comparison](#basic-type-comparison)
  - [Object Comparison](#object-comparison)
  - [Array Comparison (Custom Primary Key)](#array-comparison-custom-primary-key)
  - [Nested Object Comparison](#nested-object-comparison)
- [API Documentation](#api-documentation)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

---

## Features
1. **Support for Multiple Types**: Covers the comparison of basic types (strings, numbers, booleans) and complex types (objects, arrays).
2. **Flexible Primary Key Configuration**: You can define composite primary keys through `primaryKeyFields` to precisely match objects in arrays.
3. **Detailed Difference Reports**: Returns structured data containing the difference type, original value, and comparison value for easy analysis.
4. **Lightweight Dependencies**: Only depends on a small utility library, with a small size and high performance, without adding extra burden.
5. **TypeScript Support**: Natively supports TypeScript, providing complete type definitions to enhance the development experience.

---

## Installation
You can install `diffoo` in the following two ways:

### Using npm
```bash
npm install diffoo
```

### Using yarn
```bash
yarn add diffoo
```

---

## Quick Start
The following is a simple example showing how to use `diffoo` for object comparison:

```typescript
import { DefaultPolicyFactory } from 'diffoo';

// Initialize the comparison strategy
const policy = new DefaultPolicyFactory();

// Define the original object and the comparison object
const origin = { name: 'Alice', age: 30 };
const comparing = { name: 'Alice', age: 31 };

// Perform the comparison
const result = policy.produce(origin, comparing);

// Output the difference result
console.log(result);
/* Output:
ObjectDiff {
  diffType: 'Update',
  diffObj: {
    age: {
      diffType: 'Update',
      originRawObj: 30,
      comparingRawObj: 31
    }
  }
}
*/
```

---

## Usage Examples

### Basic Type Comparison
This scenario is used to detect changes in strings or numbers:

```typescript
import { DefaultPolicyFactory } from 'diffoo';

const policy = new DefaultPolicyFactory();

// Compare strings
const strResult = policy.produce('Hello', 'Hello World');
console.log(strResult.diffType); // Output: 'Update'

// Compare numbers
const numResult = policy.produce(42, 43);
console.log(numResult.diffType); // Output: 'Update'
```

### Object Comparison
Compare the property differences between two objects:

```typescript
const originObj = { id: 1, name: 'Alice', active: true };
const comparingObj = { id: 1, name: 'Alice (Updated)', active: false };

const result = policy.produce(originObj, comparingObj);
console.log(result.diffObj);
/* Output:
{
  name: {
    diffType: 'Update',
    originRawObj: 'Alice',
    comparingRawObj: 'Alice (Updated)'
  },
  active: {
    diffType: 'Update',
    originRawObj: true,
    comparingRawObj: false
  }
}
*/
```

### Array Comparison (Custom Primary Key)
When comparing object arrays, match elements by the primary key (such as `id`) and ignore the order:

```typescript
const originArray = [
  { id: 1, value: 'A' },
  { id: 2, value: 'B' },
];
const comparingArray = [
  { id: 2, value: 'B (Updated)' },
  { id: 3, value: 'C' }, // New element
];

const options = { primaryKeyFields: ['id'] };
const result = policy.produce(originArray, comparingArray, options);

console.log(result.diffObj);
/* Output:
[
  {
    diffType: 'Update',
    originRawObj: { id: 2, value: 'B' },
    comparingRawObj: { id: 2, value: 'B (Updated)' }
  },
  {
    diffType: 'Create',
    comparingRawObj: { id: 3, value: 'C' }
  }
]
*/
```

### Nested Object Comparison
Compare complex objects with multiple levels of nesting:

```typescript
const originNested = {
  user: {
    profile: {
      name: 'John',
      settings: { darkMode: false }
    }
  }
};
const comparingNested = {
  user: {
    profile: {
      name: 'John Doe',
      settings: { darkMode: true }
    }
  }
};

const result = policy.produce(originNested, comparingNested);
console.log(result.diffObj);
/* Output:
{
  user: {
    diffType: 'Update',
    diffObj: {
      profile: {
        diffType: 'Update',
        diffObj: {
          name: {
            diffType: 'Update',
            originRawObj: 'John',
            comparingRawObj: 'John Doe'
          },
          settings: {
            diffType: 'Update',
            originRawObj: false,
            comparingRawObj: true
          }
        }
      }
    }
  }
}
*/
```

---

## API Documentation

### DefaultPolicyFactory Class
This is a factory class for creating comparison strategies.

#### Methods
- `produce (origin: any, comparing: any, options?: CompareOptions): DiffResult`  
  Performs an object comparison and returns the difference result.
  - `origin`: The original object.
  - `comparing`: The object used for comparison.
  - `options` (optional): Configuration parameters, supporting `primaryKeyFields: string[]` to define the primary key fields for array comparison.

#### Return Value `DiffResult`
An object containing the difference type and detailed information, with the following structure:

```typescript
interface DiffResult {
  diffType: 'Equal' | 'Update' | 'Create' | 'Delete';
  diffObj?: Record<string, any> | any[]; // Difference details
  originRawObj?: any; // Original value (only for some types)
  comparingRawObj?: any; // Comparison value (only for some types)
}
```

---

## Contribution Guidelines
If you want to contribute to the `diffoo` project, please follow these steps:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/MPandAdev/Diffoo.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Development and testing**: After modifying the code, run the following command to verify the functionality:
   ```bash
   npm test
   ```
4. **Submit a PR**: Please follow the code style, add clear comments and test cases.

---

## License
This project is licensed under the MIT License. For details, please see [LICENSE](https://github.com/MPandAdev/Diffoo/blob/main/LICENSE).

---