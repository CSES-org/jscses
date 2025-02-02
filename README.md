# jscese 使用文档

## 1. 简介

本NODE模块提供了 `CSESParser` 和 `CSESGenerator` 两个类，用于解析和生成 CSES 格式的 YAML 文件。CSES 格式为课表迁移统一格式。

## 2. 安装模块

```bash
npm install jscses
```

## 3. CSESParser 类

`CSESParser` 类用于解析 CSES 格式的 YAML 文件，并提取课程信息和课程安排。

### 3.1 构造函数

```javascript
const { CSESParser } = require('jscses');

const parser = new CSESParser(filePath);
```

参数：
- `filePath`：CSES 格式的 YAML 文件路径。

### 3.2 方法

#### 3.2.1 getSubjects()

获取所有科目信息。

返回值：返回一个数组，包含所有科目的信息，每个科目是一个对象，包含以下字段：
- `name`：科目名称。
- `simplified_name`：科目简称（可选）。
- `teacher`：教师姓名（可选）。
- `room`：教室名称（可选）。

#### 3.2.2 getSchedules()

获取所有课程安排。

返回值：返回一个数组，包含所有课程安排的信息，每个课程安排是一个对象，包含以下字段：
- `name`：课程安排名称（如“星期一”）。
- `enable_day`：课程安排的星期（如 'mon'、'tue' 等）。
- `weeks`：周次类型（如 'all'、'odd'、'even'）。
- `classes`：课程列表，每个课程是一个对象，包含以下字段：
  - `subject`：科目名称。
  - `start_time`：课程开始时间。
  - `end_time`：课程结束时间。

#### 3.2.3 getScheduleByDay(day)

根据星期获取课程安排。

参数：
- `day`：星期（如 'mon'、'tue' 等）。

返回值：返回该星期的课程安排数组，每个课程是一个对象，包含以下字段：
- `subject`：科目名称。
- `start_time`：课程开始时间。
- `end_time`：课程结束时间。

#### 3.2.4 static isCsesFile(filePath)

判断是否为 CSES 格式的文件。

参数：
- `filePath`：文件路径。

返回值：返回一个布尔值，表示该文件是否为 CSES 格式的文件。

## 4. CSESGenerator 类

`CSESGenerator` 类用于生成 CSES 格式的 YAML 文件。

### 4.1 构造函数

```javascript
const { CSESGenerator } = require('jscses');

const generator = new CSESGenerator(version);
```

参数：
- `version`：CSES 格式的版本号，默认为 1。

### 4.2 方法

#### 4.2.1 addSubject(name, simplifiedName, teacher, room)

添加科目信息。

参数：
- `name`：科目名称。
- `simplifiedName`：科目简称（可选）。
- `teacher`：教师姓名（可选）。
- `room`：教室名称（可选）。

#### 4.2.2 addSchedule(name, enableDay, weeks, classes)

添加课程安排。

参数：
- `name`：课程安排名称（如“星期一”）。
- `enableDay`：课程安排的星期（如 'mon'、'tue' 等）。
- `weeks`：周次类型（如 'all'、'odd'、'even'）。
- `classes`：课程列表，每个课程是一个对象，包含以下字段：
  - `subject`：科目名称。
  - `start_time`：课程开始时间。
  - `end_time`：课程结束时间。

#### 4.2.3 generateCsesData()

生成 CSES 格式的字典数据。

返回值：返回一个对象，包含 CSES 格式的字典数据。

#### 4.2.4 saveToFile(filePath)

将 CSES 数据保存到 YAML 文件。

参数：
- `filePath`：输出文件路径。

## 5. 示例代码

### 5.1 使用 CSESParser

```javascript
const { CSESParser } = require('jscses');

try {
    const parser = new CSESParser('path/to/cses_file.yaml');
    const subjects = parser.getSubjects();
    console.log('Subjects:', subjects);

    const schedules = parser.getSchedules();
    console.log('Schedules:', schedules);

    const mondaySchedule = parser.getScheduleByDay('mon');
    console.log('Monday Schedule:', mondaySchedule);
} catch (error) {
    console.error('Error:', error.message);
}
```

### 5.2 使用 CSESGenerator

```javascript
const { CSESGenerator } = require('jscses');

const generator = new CSESGenerator();

// 添加科目
generator.addSubject('Math', 'M', 'John Doe', 'Room 101');
generator.addSubject('Science', 'Sci', 'Jane Smith', 'Room 102');

// 添加课程安排
generator.addSchedule('Monday', 'mon', 'all', [
    { subject: 'Math', start_time: '09:00', end_time: '10:00' },
    { subject: 'Science', start_time: '10:00', end_time: '11:00' }
]);

// 保存到文件
generator.saveToFile('path/to/output_file.yaml');
```

## 6. 注意事项

确保输入的 YAML 文件格式正确，否则可能会导致解析失败。
在生成 YAML 文件时，确保输出路径有效且具有写入权限。

## 7. 联系方式

如有任何问题或建议，发布议题，感谢您的使用。
