import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
  try {
    const title = req.query.keywords;
    const category = req.query.category;
    const query = {};
    if (title) {
      query.title = new RegExp(title, "i");
    }
    if (category) {
      query.category = new RegExp(category, "i");
    }
    const collection = db.collection("questions");
    const allQuestions = await collection.find(query).limit(10).toArray();
    return res.json({ data: allQuestions });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.id);

    const questionsById = await collection.findOne({ _id: questionId });

    return res.json({ data: questionsById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionData = { ...req.body, ctreated_at: new Date() };
    const newQuestionData = await collection.insertOne(questionData);
    return res.json({
      message: `Question Id ${newQuestionData.insertedId} has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

// questionRouter.post("/", async (req, res) => {  //post many
//   try {
//     const collection = db.collection("questions");
//     const questionDataArray = req.body.map((question) => ({
//       ...question,
//       created_at: new Date(),
//     }));
//     const newQuestionData = await collection.insertMany(questionDataArray);
//     return res.json({
//       message: `${newQuestionData.insertedCount} questions have been created successfully`,
//     });
//   } catch (error) {
//     return res.json({
//       message: `${error}`,
//     });
//   }
// });

questionRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const newQuestionData = { ...req.body, modified_at: new Date() };
    const questionId = new ObjectId(req.params.id);
    await collection.updateOne(
      {
        _id: questionId,
      },
      {
        $set: newQuestionData,
      }
    );

    return res.json({
      message: `Question ID ${questionId} has been updated successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: questionId });

    return res.json({
      message: `Question ID ${questionId} has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

//ทำ optional add answer (<300 char) use middleware

export default questionRouter;
