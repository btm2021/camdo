
import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { PromptTemplate } from "@langchain/core/prompts";
import {
    RunnablePassthrough,
    RunnableSequence,
} from "@langchain/core/runnables";
import { OpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import translate from "translate";

export default async function handler(req, res) {


    const q = "Hãy tìm kiếm khách hàng có tổng tiền hóa đơn lớn nhất"

    const textTrain = await translate(q, { to: "en", from: "vi" })
    //console.log(textTrain)
    const template = `You are a Postgres expert. Given an input question, first create a syntactically correct Postgres query to run, then look at the results of the query and return the answer to the input question.
Always query for all columns from a table. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
Pay attention to use date('now') function to get the current date, if the question involves "today".
Use the following format:

Question: <Question here>
SQLQuery: <SQL Query to run>
SQLResult: <Result of the SQLQuery>
Answer: <Final answer here>

Only use the following tables:

{schema}

QUESTION: {question}
SQLQuery:`;

    const prompt = PromptTemplate.fromTemplate(template);
    const datasource = new DataSource({
        type: "postgres",
        host: "db.ajsrzteoovahabndebyp.supabase.co",
        port: 5432,
        username: "postgres",
        password: "trinhminhbao@1991",
        database: "postgres",
    });

    const llm = new OpenAI({
        modelName: "gpt-4",
        temperature: 0.7,
        openAIApiKey: "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", // In Node.js defaults to process.env.OPENAI_API_KEY
    });

    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
    });

    const sqlQueryGeneratorChain = RunnableSequence.from([
        RunnablePassthrough.assign({
            schema: async () => db.getTableInfo(),
        }),
        prompt,
        llm.bind({ stop: ["\nSQLResult:"] }),
        new StringOutputParser(),
    ]);

    const result = await sqlQueryGeneratorChain.invoke({
        question: textTrain,
    });

    console.log(
        result,
    );

    //let r = await db.run(result);
    //console.log(r)
    //nex

    const finalResponsePrompt =
        PromptTemplate.fromTemplate(`
Based on the table schema below, question, sql query, and sql response, write a natural language response.REMEBER always response by vietnamese language:
{schema}.

Question: {question}
SQL Query: {query}
SQL Response: {response}
`);

    const fullChain = RunnableSequence.from([
        RunnablePassthrough.assign({
            query: sqlQueryGeneratorChain,
        }),
        {
            schema: async () => db.getTableInfo(),
            question: (input) => input.question,
            query: (input) => input.query,
            response: (input) => db.run(input.query),
        },
        finalResponsePrompt,
        llm,
    ]);

    const finalResponse = await fullChain.invoke({
        question: q,
    });

    console.log(finalResponse);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ name: finalResponse });
}
