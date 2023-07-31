import { Configuration, OpenAIApi } from "openai";
import { resumePrompt } from "./resumePrompt";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

configuration.baseOptions.headers = {
  Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
};

const openAI = new OpenAIApi(configuration);

const parseGPT = async (text) => {
  const initalPrompt = resumePrompt.initalPrompt;
  const endPrompt = resumePrompt.endPrompt;
  const skillsPrompt = resumePrompt.skillsPrompt;
  const companiesPrompt = resumePrompt.companiesPrompt;
  const educationPrompt = resumePrompt.educationPrompt;

  const prompt1 = initalPrompt.concat(educationPrompt, endPrompt, text);

  console.log(prompt1);

  const chatCompletion = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt1 }],
  });
  console.log(chatCompletion.data.choices[0].message.content);
  return chatCompletion;
};

export const openAIMethods = {
  parseGPT,
};
