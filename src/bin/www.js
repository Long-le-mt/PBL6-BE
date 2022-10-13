import app from "index";
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log(`Express server listening on port ${app.get("port")}`);
});