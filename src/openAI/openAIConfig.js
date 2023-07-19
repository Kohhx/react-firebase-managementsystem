import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});


configuration.baseOptions.headers = {
  Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
};


const openAI = new OpenAIApi(configuration);

// const chatCompletion = await openai.createChatCompletion({
//   model: "gpt-3.5-turbo",
//   messages: [{ role: "user", content: "Hello world" }],
// });

const createQuizGPT = async (category, noOfQuestions) => {
  const chatCompletion = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Help me create a ${category} quiz with ${noOfQuestions} questions. Return in a JSON format and not other text.
    0)id (String): id of the quiz
    1)questionTitle (String): question for the quiz
    2)option1 (String): option 1 for the quiz
    3)option2 (String): option 2 for the quiz
    4)option3 (String): option 3 for the quiz
    5)option4 (String): option 4 for the quiz
    6)answer (String): Which option is the right answer. 1,2,3 or 4
    7)difficulty (String): easy, medium or hard
    8)category (String): category of the quiz

    Return only JSON format. There should be no other string.
    ` }],
  });
  console.log(chatCompletion.data.choices[0].message.content);
  return chatCompletion;
}


export const openAIMethods = {
  createQuizGPT
}
