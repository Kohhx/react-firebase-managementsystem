import React, { useState, useEffect } from "react";
import { openAI, openAIMethods } from "../openAI/openAIConfig";

const Quiz = () => {
  const [category, setCategory] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState(5);
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(0);
  const [questions, setQuestions] = useState([]);

  function filterJSONObjectsFromString(string) {
    const jsonObjects = [];
    const regex = /{[^{}]+}/g;
    const matches = string.match(regex);

    if (matches) {
      matches.forEach((match) => {
        try {
          const jsonObject = JSON.parse(match);
          jsonObjects.push(jsonObject);
        } catch (error) {
          // Handle any parsing errors if needed
        }
      });
    }
    return jsonObjects;
  }

  const createQuiz = async (category, noOfQuestions) => {
    setLoading(true);
    const questions = await openAIMethods.createQuizGPT(
      category,
      noOfQuestions
    );
    // Filter message and return only the JSON from questions
    const chatGPTMessage = questions.data.choices[0].message.content;
    console.log("Filter", filterJSONObjectsFromString(chatGPTMessage));
    setQuestions(filterJSONObjectsFromString(chatGPTMessage));
    setLoading(false);
    setResponse({});
  };
  console.log(questions);
  console.log(response);

  const submitResponse = () => {
    let result = 0;
    questions.forEach((question) => {
      if (!response.id) result += 0;
      if (+question.answer === response[question.id]) {
        result++;
      }
      result += 0;
    });
    setResult(result);
    console.log(result);
  };

  return (
    <div>
      <div className="ml-3 mt-4 flex gap-3">
        <input
          value={category}
          className="border border-2 pl-2"
          onChange={(e) => setCategory(e.target.value)}
          type="text"
          placeholder="Key in a category"
        />
        <input
          value={noOfQuestions}
          onChange={(e) => setNoOfQuestions(e.target.value)}
          className="border border-2 pl-2"
          type="number"
          placeholder="Enter a value"
        />
        <button
          onClick={() => createQuiz(category, noOfQuestions)}
          className="border bg-blue-500 px-2 py-1 rounded hover:bg-blue-300 disabled:bg-blue-200"
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Quiz"}
        </button>
      </div>

      {/* // Questions  */}
      {questions.length > 0 && (
        <>
          {" "}
          <div className="w-[90%] mx-auto mt-10">
            {questions.map((question, index) => (
              <div className="mb-5">
                <p>
                  <span className="font-bold">
                    {index + 1}) {question.questionTitle}
                  </span>
                </p>
                <div className="options-section flex flex-col gap-2 mt-3">
                  <div>
                    <input
                      type="radio"
                      name={`q${index + 1}`}
                      onChange={() =>
                        setResponse({ ...response, [question.id]: 1 })
                      }
                    />
                    <span className="ml-2">{question.option1}</span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name={`q${index + 1}`}
                      onChange={() =>
                        setResponse({ ...response, [question.id]: 2 })
                      }
                    />
                    <span className="ml-2">{question.option2}</span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name={`q${index + 1}`}
                      onChange={() =>
                        setResponse({ ...response, [question.id]: 3 })
                      }
                    />
                    <span className="ml-2">{question.option3}</span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name={`q${index + 1}`}
                      onChange={() =>
                        setResponse({ ...response, [question.id]: 4 })
                      }
                    />
                    <span className="ml-2">{question.option4}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center">
              <button
                onClick={submitResponse}
                className="px-3 py-1.5 bg-yellow-300 rounded mb-5 border border-amber-900"
              >
                Submit Answers
              </button>
            </div>
          </div>
          <div>
            Results: {result} / {questions.length}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
