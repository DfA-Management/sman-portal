const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { filename, content, mimeType } = data;

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    await octokit.repos.createOrUpdateFileContents({
      owner: "DfA-Management",
      repo: "sman-portal",
      path: `uploads/${filename}`,
      message: `Upload file ${filename} via Netlify`,
      content: content, // base64 encoded
      committer: { name: "Uploader", email: "admin@smansa.sch.id" },
      author: { name: "Uploader", email: "admin@smansa.sch.id" }
    });

    return {
      statusCode: 200,
      body: "Berhasil upload ke GitHub!"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Upload gagal: " + err.message
    };
  }
};
