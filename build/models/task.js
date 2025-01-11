"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _mongooseConfig_1 = require("./_mongooseConfig");
const taskSchema = new _mongooseConfig_1.Schema({
    text: { type: String },
    completed: { Type: Boolean }
});
const Task = _mongooseConfig_1.mongoose.model("Tasks", taskSchema);
module.exports = Task;
