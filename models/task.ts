import {mongoose, Schema} from "./_mongooseConfig"


const taskSchema = new Schema({
    text: { type: String },
    completed: {Type: Boolean}
});

const Task = mongoose.model("Tasks", taskSchema);
module.exports = Task;

