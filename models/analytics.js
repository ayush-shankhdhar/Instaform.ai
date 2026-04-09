const mongoose=require("mongoose");
 
const analyticsSchema=new mongoose.Schema({
    formNo: {
        type: String,
        required: true,
        ref: "Form"
    },
    responses: {
        type: [Object],
        default: []
    }
});

const analyticsModel = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);

module.exports = analyticsModel;