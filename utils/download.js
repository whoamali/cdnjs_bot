const fs = require("fs");
const path = require("path");

const sharp = require("sharp");
const request = require("request");

exports.downloadImage = (url, filename, callback) => {
  let fileExtension = false;
  fs.readdir(path.join(__dirname, "../files/images"), (err, files) => {
    if (err) callback(err, path.join(__dirname, "../files", "default.png"));
    files.map((file) => {
      if (file === filename) {
        fileExtension = true;
        return;
      }
    });
  });
  if (!fileExtension) {
    request.head(url, function (err, res, body) {
      if (err) callback(err, path.join(__dirname, "../files", "default.png"));

      request(url)
        .pipe(
          fs.createWriteStream(
            path.join(__dirname, "../files/images", filename)
          )
        )
        .on("close", (err) => {
          if (err)
            return callback(
              err,
              path.join(__dirname, "../files", "default.png")
            );
          sharp(path.join(__dirname, "../files/images", filename))
            .png({ quality: 80 })
            .toFile(
              path.join(
                __dirname,
                "../files/images",
                filename.split(".")[0] + ".png"
              ),
              (err) => {
                if (err) {
                  callback(
                    err,
                    path.join(__dirname, "../files", "default.png")
                  );
                } else {
                  callback(
                    null,
                    path.join(
                      __dirname,
                      "../files/images",
                      filename.split(".")[0] + ".png"
                    )
                  );
                }
              }
            );
        });
    });
  } else {
    callback(null, path.join(__dirname, "../files/images", filename));
  }
};

exports.downloadSource = (text, filename, callback) => {
  let fileExtension = false;
  fs.readdir(path.join(__dirname, "../files/sources"), (err, files) => {
    if (err) callback(err, path.join(__dirname, "../files/sources", filename));

    files.map((file) => {
      if (file === filename) {
        fileExtension = true;
        return;
      }
    });

    if (!fileExtension) {
      fs.writeFile(
        path.join(__dirname, "../files/sources", filename),
        text,
        (err) => {
          if (err)
            return callback(
              err,
              path.join(__dirname, "../files/sources", filename)
            );
          callback(null, path.join(__dirname, "../files/sources", filename));
        }
      );
    } else {
      callback(null, path.join(__dirname, "../files/sources", filename));
    }
  });
};
