const OpenAI = require('openai');

const openai = new OpenAI();

// cmd: setx OPENAI_API_KEY "your-api-key-here"

exports.getOneChat = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const message = req.body.prompt;
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: message }],
            model: "gpt-3.5-turbo",
            // model: "gpt-4-turbo",
          });
        
        //   console.log(completion.choices[0]);
          res.json({ response: completion.choices[0].message });
    } catch (error) {
        console.error("Error fetching the OpenAI response:", error);
        res.status(500).send(error.message);
    }
};