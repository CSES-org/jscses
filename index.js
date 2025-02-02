const yaml = require('js-yaml');
const fs = require('fs');

// 解析器
class CSESParser {
    constructor(filePath) {
        /**
         * 初始化 CSES 解析器
         * @param {string} filePath - CSES 格式的 YAML 文件路径
         */
        this.filePath = filePath;
        this.data = null;
        this.version = null;
        this.subjects = [];
        this.schedules = [];
        
        this._loadFile();
        this._parseData();
    }

    _loadFile() {
        /** 加载并解析 YAML 文件 */
        try {
            const fileContents = fs.readFileSync(this.filePath, 'utf8');
            this.data = yaml.load(fileContents);
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`File ${this.filePath} Not Found`);
            } else if (error instanceof yaml.YAMLException) {
                throw new Error(`YAML Error: ${error.message}`);
            } else {
                throw error;
            }
        }
    }

    _parseData() {
        /** 解析 YAML 数据 */
        if (!this.data) return;

        // 获取版本信息
        this.version = this.data.version || 1;

        // 解析科目信息
        const subjectsData = this.data.subjects || [];
        for (const subject of subjectsData) {
            this.subjects.push({
                name: subject.name,
                simplified_name: subject.simplified_name || null,
                teacher: subject.teacher || null,
                room: subject.room || null
            });
        }

        // 解析课程安排
        const schedulesData = this.data.schedules || [];
        for (const schedule of schedulesData) {
            const classes = [];
            for (const cls of schedule.classes || []) {
                classes.push({
                    subject: cls.subject,
                    start_time: cls.start_time,
                    end_time: cls.end_time
                });
            }

            this.schedules.push({
                name: schedule.name,
                enable_day: schedule.enable_day,
                weeks: schedule.weeks,
                classes: classes
            });
        }
    }

    getSubjects() {
        /** 获取所有科目信息 */
        return this.subjects;
    }

    getSchedules() {
        /** 获取所有课程安排 */
        return this.schedules;
    }

    getScheduleByDay(day) {
        /**
         * 根据星期获取课程安排
         * @param {string} day - 星期（如 'mon', 'tue' 等）
         * @returns {Array} 该星期的课程安排
         */
        const schedule = this.schedules.find(s => s.enable_day === day);
        return schedule ? schedule.classes : [];
    }

    static isCsesFile(filePath) {
        /**
         * 判断是否为 CSES 格式的文件
         * @param {string} filePath - 文件路径
         * @returns {boolean} 是否为 CSES 文件
         */
        try {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const data = yaml.load(fileContents);
            return data.hasOwnProperty('version') && 
                   data.hasOwnProperty('subjects') && 
                   data.hasOwnProperty('schedules');
        } catch {
            return false;
        }
    }
}

// 生成器
class CSESGenerator {
    constructor(version = 1) {
        /**
         * 初始化 CSES 生成器
         * @param {number} [version=1] - CSES 格式的版本号
         */
        this.version = version;
        this.subjects = [];
        this.schedules = [];
    }

    addSubject(name, simplifiedName = null, teacher = null, room = null) {
        /**
         * 添加科目信息
         * @param {string} name - 科目名称
         * @param {string} [simplifiedName] - 科目简称
         * @param {string} [teacher] - 教师姓名
         * @param {string} [room] - 教室名称
         */
        this.subjects.push({
            name,
            simplified_name: simplifiedName,
            teacher,
            room
        });
    }

    addSchedule(name, enableDay, weeks, classes) {
        /**
         * 添加课程安排
         * @param {string} name - 课程安排名称（如 "星期一"）
         * @param {string} enableDay - 课程安排的星期（如 'mon', 'tue' 等）
         * @param {string} weeks - 周次类型（如 'all', 'odd', 'even'）
         * @param {Array} classes - 课程列表
         */
        this.schedules.push({
            name,
            enable_day: enableDay,
            weeks,
            classes: classes.map(cls => ({
                subject: cls.subject,
                start_time: cls.start_time,
                end_time: cls.end_time
            }))
        });
    }

    generateCsesData() {
        /**
         * 生成 CSES 格式的字典数据
         * @returns {Object} CSES 格式的字典数据
         */
        return {
            version: this.version,
            subjects: this.subjects,
            schedules: this.schedules
        };
    }

    saveToFile(filePath) {
        /**
         * 将 CSES 数据保存到 YAML 文件
         * @param {string} filePath - 输出文件路径
         */
        const csesData = this.generateCsesData();
        try {
            const yamlStr = yaml.dump(csesData, { 
                skipInvalid: true,
                noRefs: true,
                lineWidth: -1 
            });
            fs.writeFileSync(filePath, yamlStr, 'utf8');
        } catch (error) {
            throw new Error(`Failed to write ${filePath}: ${error.message}`);
        }
    }
}

// 示例用法
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length !== 1) {
        console.log(`Check CSES File
Usage: node index.js <cses_file>`);
        process.exit(1);
    }
    
    const filePath = args[0];
    
    if (!CSESParser.isCsesFile(filePath)) {
        console.log("Not a valid CSES file");
        process.exit(1);
    }
    
    const parser = new CSESParser(filePath);
    
    console.log("All Subjects:");
    for (const subject of parser.getSubjects()) {
        console.log(`${subject.name} (${subject.simplified_name || ''})`);
        console.log(`- Teacher: ${subject.teacher || ''}`);
        console.log(`- Room: ${subject.room || ''}`);
    }
    
    console.log("\nAll Schedules:");
    for (const schedule of parser.getSchedules()) {
        console.log(`${schedule.name} (${schedule.enable_day} ${schedule.weeks}):`);
        for (const cls of schedule.classes) {
            console.log(`- ${cls.subject} (${cls.start_time} - ${cls.end_time})`);
        }
    }
}