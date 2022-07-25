const fetch = require("node-fetch");

const searchModule = async (text) => {
  const module = await fetch(
    `https://api.cdnjs.com/libraries?search=${text}&limit=15`
  );
  return await module.json();
};

const findModule = async (text) => {
  const response = await fetch(
    `https://api.cdnjs.com/libraries/${text}?fields=name,description,latest,homepage,version,license,author`
  );

  return response;
};

exports.search = async (ctx) => {
  ctx.reply("Searching...");

  const response = await findModule(ctx.message.text);
  const data = await response.json();

  if (data.error && data.status === 404) {
    const modules = await searchModule(ctx.message.text);
    if (modules.results.length > 0) {
      let result = "Find modules:\n";
      modules.results.forEach((module) => {
        result += `${module.name} - latest:\n${module.latest}\n`
      });
      ctx.reply(result);
    } else {
      ctx.reply("No modules found");
    }
  } else {
    const latest = await fetch(data.latest);
    const latestRes = await latest.text();

    require("./../utils/download").downloadImage(
      `https://cdn.worldvectorlogo.com/logos/${ctx.message.text}-1.svg`,
      `${ctx.message.text}.svg`,
      (err, path) => {
        ctx.replyWithPhoto(
          {
            source: path,
          },
          {
            caption: `name: ${data.name}\ndescription:\n${data.description}\nlatest:\n${data.latest}\nhomepage:\n${data.homepage}\nversion: ${data.version}\nlicense: ${data.license}`,
          }
        );
      }
    );

    setTimeout(async () => {
      require("./../utils/download").downloadSource(
        latestRes,
        `${ctx.message.text}.${
          data.latest.split(".")[data.latest.split(".").length - 1]
        }`,
        (err, path) => {
          ctx.replyWithDocument(
            {
              source: path,
            },
            {
              caption: data.description,
            }
          );
        }
      );
    }, 5000);
  }
};
