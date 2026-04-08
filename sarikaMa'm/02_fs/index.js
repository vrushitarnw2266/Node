// File System Module
// ASYNCHRONOUS

const fs = require("fs");
//1. Create a file
fs.writeFile("demo.txt", "Hello File System", (err) => {
  if (err) throw err;
  console.log("File Created");

  //2. Read a file
  fs.readFile("demo.txt", "utf-8", (err, data) => {
    if (err) throw err;
    console.log(data);

    //3. Append a file
    fs.appendFile("demo.txt", "\nDataAppended", (err) => {
      if (err) throw err;
      console.log("Data Appended");

      //5. Rename a file
      fs.rename("demo.txt", "demo1.txt", (err) => {
        if (err) throw err;
        console.log("File Renamed");

        //10. File Stats
        fs.stat("demo1.txt", (err, stats) => {
          if (err) throw err;
          console.log(stats);

          //4. Delete a file
          fs.unlink("demo1.txt", (err) => {
            if (err) throw err;
            console.log("File Deleted");

          //6. check file exists or not
          fs.access("demo.txt", (err) => {
            console.log(err ? "File does not exist" : "File Exists");

            //7. Create Folder
            fs.mkdir("myFolder", (err) => {
              if (err && err.code !== 'EEXIST') throw err;
              console.log("Folder Created");

              //8. Read Folder
              fs.readdir("myFolder", (err, files) => {
                if (err) throw err;
                console.log(files);

                  //9. Delete Folder
                  fs.rmdir("myFolder", (err) => {
                    if (err) throw err;
                    console.log("Folder Deleted");
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
