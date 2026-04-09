const mongoose=require("mongoose");

const formSchema=new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    body: {
        type: String,
        required: true,
    },
    formNo: {
        type: String,
        required: true,
    },
    formName: {
        type: String,
        required: true,
    }
});

const formModel = mongoose.models.Form ||  mongoose.model("Form", formSchema);

module.exports = formModel;