import * as http from "http";
import fs, { promises as fsPromises } from "fs";
import path from "path";

const server = http.createServer((req, res) => {
  const productsFilePath = path.join(__dirname, "data", "products.json");
  const assetsPath = path.join(__dirname, "assets");

  if (req.url === "/products") {
    fs.access(productsFilePath, err => {
      if (err) {
        console.error("File does not exist or cannot be accessed:", productsFilePath);
        return;
      }

      fs.readFile(productsFilePath, "utf8", (err, data) => {
        const jsonProducts: { products: [{ id: number; title: string; description: string }] } = JSON.parse(data);
        // ** Write into a file

        res.writeHead(200, { "Content-Type": "application/json" });
        console.log("DATA =>", jsonProducts);
        res.write(data);
        res.end();
      });
    });
  } else if (req.url === "/products/new") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`<html>
            <head>
                <title>Add New Product</title>
            </head>
            <body>
                <h2>Add New Product</h2>
                <form method="POST" action="/add-product">
                    <label for="title">Title:</label><br>
                    <input type="text" id="title" name="title" required ><br><br>
                    <label for="title">Description:</label><br>
                    <textarea type="text" id="description" name="description" required></textarea>
                    <br><br>
                    <button type="submit">Add Product</button>
                </form>
            </body>
            </html>`);
    res.end();
  } else if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome back!</h1>");
  } else if (req.method === "POST" && req.url === "/add-product") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = new URLSearchParams(body);
      const title = data.get("title");
      const description = data.get("description");

      try {
        const jsonData = await fsPromises.readFile(productsFilePath, "utf8");
        const jsonProducts: { products: [{ id: number; title: string; description: string }] } = JSON.parse(jsonData);

        jsonProducts.products.push({
          id: jsonProducts.products.length + 1,
          title: title as string,
          description: description as string,
        });

        const updatedData = JSON.stringify(jsonProducts, null, 2);
        await fsPromises.writeFile(productsFilePath, updatedData, { flag: "w" });
      } catch (error) {
        console.log(error);
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(`<div>
        <h1>Product has been added!</h1>
        <h2>Title: ${title}</h2>
        <p>Description: ${description}</p>
      </div>`);
      res.end();
    });
  } else if (req.method === "GET" && req.url === "/assets") {
    fs.access(assetsPath, err => {
      if (err) {
        console.error("File does not exist or cannot be accessed:", productsFilePath);
        return;
      }

      fs.readdir(assetsPath, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>Here are your assets:</h1>");
        res.write("<ul>");
        files.forEach(file => {
          res.write(`<li><a href="/delete?file=${encodeURIComponent(file)}">${file}</a></li>`);
        });
        res.write("</ul>");
        res.end();
      });
    });
  } else if (req.method === "GET" && req.url?.startsWith("/delete")) {
    res.write("<h1>File has been deleted!</h1>");
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>Not found!</h1>");
  }
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running at => http://localhost:${PORT}`);
});
