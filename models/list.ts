import {mongoose, Schema} from "./_mongooseConfig"

const listSchecma = new Schema({
    title: { type: String },
    tasks: { type: [mongoose.Schema.Types.ObjectId], ref: "Tasks" } //array of tasks, database object reference
});

const List = mongoose.model("Lists", listSchecma);
module.exports = List;