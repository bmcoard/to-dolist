"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _mongooseConfig_1 = require("./_mongooseConfig");
const listSchecma = new _mongooseConfig_1.Schema({
    title: { type: String },
    tasks: { type: [_mongooseConfig_1.mongoose.Schema.Types.ObjectId], ref: "Tasks" } //array of tasks, database object reference
});
const List = _mongooseConfig_1.mongoose.model("Lists", listSchecma);
module.exports = List;
