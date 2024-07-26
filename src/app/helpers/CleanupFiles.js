const {
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const User = require("../models").user;

const s3Client = require("../config/aws.config");

async function cleanupUnusedFiles() {
  let FileCount = 0;
  console.log("[Cleanup Files]: Starting...");
  try {
    const users = await User.find({});
    const usedFiles = new Set();

    users.forEach((user) => {
      user.profilePic.forEach((pic) => usedFiles.add(pic.key));
      if (user.shortReel) {
        usedFiles.add(user.shortReel.key);
      }
    });

    console.log(
      `[Cleanup Files]: ${usedFiles.size} used files found in database.`
    );

    const listParams = {
      Bucket: process.env.S3_BUCKET,
    };

    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );

    const now = new Date();
    const unusedFiles = listedObjects.Contents.filter((file) => {
      const fileAge = (now - new Date(file.LastModified)) / (1000 * 60 * 60);
      return !usedFiles.has(file.Key) && fileAge > 24;
    });

    console.log(
      `[Cleanup Files]: ${unusedFiles.length} Unused files found in storage(AWS S3).`
    );

    for (const file of unusedFiles) {
        FileCount++;
        const deleteParams = {
            Bucket: process.env.S3_BUCKET,
            Key: file.Key,
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log(`[Cleanup Files][Deleted]: Key(${FileCount}): ${file.Key}.`);
    }
    console.log(`[Cleanup Files]: Task completed.`);
  } catch (err) {
    console.error(err);
  } finally {
    console.log(
      `[Cleanup Files]: ${FileCount} files deleted from storage(AWS S3).`
    );
  }
}

module.exports = cleanupUnusedFiles;
