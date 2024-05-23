const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // capture the body
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // when done receiving all body
  req.on("end", () => {

    if (reqBody) {
      // Parse the body of the request as JSON if Content-Type header is
      // application/json

      if (req.headers["content-type"] === "application/json") {
        req.body = JSON.parse(reqBody);

      } else {

      // Parse the body of the request as x-www-form-urlencoded if Content-Type
      // header is x-www-form-urlencoded
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      }

      // Log the body of the request to the terminal
      console.log(req.body);
    }

    // Make the res body
    const resBody = {
      "Hello": "World!"
    };

    // Return the `resBody` object as JSON in the body of the response
    // 1. set status code
    res.statusCode = 200;
    // 2. set header
    res.setHeader("Content-Type", "application/json");
    // 3. turn the res body to json and send res
    return res.end(JSON.stringify(resBody));
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
